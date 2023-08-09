import React, { useEffect, useRef, useState } from "react";
import {
  Navbar,
  Page,
  Messages,
  MessagesTitle,
  Message,
  Messagebar,
  Link,
  f7ready,
  f7,
  useStore,
} from "framework7-react";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
let mediaRecorder;
let chunks = [];

export default ({ id }) => {
  const [typingMessage, setTypingMessage] = useState(false);
  const [messageText, setMessageText] = useState("");

  const conversations = useStore("conversations");
  const messagesData = useStore("messagesData");

  const [conversation, setConversation] = useState(null);

  const [isRecording, setIsRecording] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);

  useEffect(() => {
    f7ready(() => {
      // load corresponding conversation
      const theConversation = conversations.find((item) => {
        return item.id === id;
      });

      if (theConversation) {
        setConversation(theConversation);
      }
    });
  }, []);

  useEffect(() => {
    if (isRecording !== null && !isRecording) {
      setIsRecognizing(true);
    }
  }, [isRecording]);

  const setMessagesData = (data) => {
    f7.store.dispatch("setMessagesData", data);
  };

  const isFirstMessage = (message, index) => {
    const previousMessage = messagesData[index - 1];
    if (message.isTitle) return false;
    if (
      !previousMessage ||
      previousMessage.type !== message.type ||
      previousMessage.name !== message.name
    )
      return true;
    return false;
  };

  const isLastMessage = (message, index) => {
    const nextMessage = messagesData[index + 1];
    if (message.isTitle) return false;
    if (
      !nextMessage ||
      nextMessage.type !== message.type ||
      nextMessage.name !== message.name
    )
      return true;
    return false;
  };

  const isTailMessage = (message, index) => {
    const nextMessage = messagesData[index + 1];
    if (message.isTitle) return false;
    if (
      !nextMessage ||
      nextMessage.type !== message.type ||
      nextMessage.name !== message.name
    )
      return true;
    return false;
  };

  const sendMessage = async () => {
    const text = messageText.trim();

    if (text.length === 0) return;

    const newMessagesData = [...messagesData];
    newMessagesData.push({
      type: "sent",
      text: text,
      conversationId: id,
    });

    // update lastMessage to user's message
    updateConversationProperty("lastMessage", text);

    setMessagesData(newMessagesData);
    setMessageText("");

    // Show loading indicator
    setTypingMessage(true);

    // ChatGPT API
    const response = await fetch(
      `https://cm633.fluentgpt.app/openai/v1/chat/completions`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          temperature: conversation?.temperature,
          messages: [
            { role: "system", content: conversation?.prompt },
            ...newMessagesData
              .filter((message) => message.conversationId === id)
              .map((message) => {
                return {
                  role: message.type === "sent" ? "user" : "assistant",
                  content: message.text,
                };
              })
              .slice(conversation?.context * -1),
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.choices.length > 0) {
      const replyFromChatGPT = data.choices[0].message.content;

      newMessagesData.push({
        type: "received",
        text: replyFromChatGPT,
        conversationId: id,
      });

      setMessagesData(newMessagesData);

      // update lastMessage to ChatGPT's reply
      updateConversationProperty("lastMessage", replyFromChatGPT);
    }

    // Stop loading indicator
    setTypingMessage(false);
  };

  const filteredMessageData = () => {
    return messagesData.filter((message) => {
      return message.conversationId === id;
    });
  };

  const updateConversationProperty = (property, value) => {
    const newConversations = [...conversations];
    const theConversation = newConversations.find((item) => {
      return item.id === id;
    });
    theConversation[property] = value;
    f7.store.dispatch("setConversations", newConversations);
  };

  const handleRecording = () => {
    if (!isRecording) {
      // Initialize
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.");
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = function (e) {
              chunks.push(e.data);

              if (mediaRecorder.state == "inactive") {
                const blob = new Blob(chunks);

                const fileOfBlob = new File([blob], "audio.wav", {
                  type: "audio/wav",
                });

                const formData = new FormData();

                formData.append("model", "whisper-1");
                formData.append("response_format", "json");
                formData.append("language", "en");
                formData.append("file", fileOfBlob);

                // send the chunks to openai whisper api
                fetch(
                  "https://cm633.fluentgpt.app/openai/v1/audio/transcriptions",
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${OPENAI_API_KEY}`,
                    },
                    body: formData,
                  }
                )
                  .then((response) => response.json())
                  .then((data) => {
                    console.log("Success:", data);
                    setMessageText(data.text);
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  })
                  .finally(() => {
                    setIsRecognizing(false);
                    chunks = [];
                  });
              }
            };

            // Start the recording
            mediaRecorder.start();
          })
          .catch((err) => {
            console.error(`The following getUserMedia error occurred: ${err}`);
          });
      } else {
        console.log("getUserMedia not supported on your browser!");
      }
    } else {
      mediaRecorder.stop();
    }

    setIsRecording(!isRecording);
  };

  return (
    <Page>
      <Navbar title="Messages" backLink="Back">
        <Link slot="right" href={`/setting/${id}/`}>
          Setting
        </Link>
      </Navbar>

      <Messagebar
        value={messageText}
        placeholder={isRecognizing ? "Recognizing Audio..." : "Message"}
        onInput={(e) => setMessageText(e.target.value)}
      >
        <Link slot="inner-start" onClick={handleRecording}>
          {!isRecording && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              style={{ display: "inline-block", width: "24px", height: "24px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </svg>
          )}

          {isRecording && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="red"
              style={{ display: "inline-block", width: "24px", height: "24px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z"
              />
            </svg>
          )}
        </Link>
        <Link slot="inner-end" onClick={sendMessage}>
          Send
        </Link>
      </Messagebar>

      <Messages>
        <MessagesTitle>
          ID: {id}, Temperature: {conversation?.temperature}, Context:{" "}
          {conversation?.context}
        </MessagesTitle>

        {filteredMessageData().map((message, index) => (
          <Message
            key={index}
            type={message.type}
            name={message.name}
            first={isFirstMessage(message, index)}
            last={isLastMessage(message, index)}
            tail={isTailMessage(message, index)}
          >
            {message.text}
          </Message>
        ))}
        {typingMessage && (
          <Message
            type="received"
            typing={true}
            first={true}
            last={true}
            tail={true}
            header={`ChatGPT is typing`}
          />
        )}
      </Messages>
    </Page>
  );
};
