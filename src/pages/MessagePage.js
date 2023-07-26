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

export default () => {
  const [typingMessage, setTypingMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  // const [messagesData, setMessagesData] = useState([]);
  const messagesData = useStore("messagesData");
  const temperature = useStore("temperature");
  const context = useStore("context");

  useEffect(() => {
    f7ready(() => {
      //
    });
  }, []);

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
    });

    setMessagesData(newMessagesData);
    setMessageText("");

    // Show loading indicator
    setTypingMessage(true);

    // ChatGPT API
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        temperature: temperature,
        messages: newMessagesData
          .map((message) => {
            return {
              role: message.type === "sent" ? "user" : "assistant",
              content: message.text,
            };
          })
          .slice(context * -1),
      }),
    });

    const data = await response.json();

    if (data.choices.length > 0) {
      const replyFromChatGPT = data.choices[0].message.content;

      newMessagesData.push({
        type: "received",
        text: replyFromChatGPT,
      });

      setMessagesData(newMessagesData);
    }

    // Stop loading indicator
    setTypingMessage(false);
  };

  return (
    <Page>
      <Navbar title="Messages">
        <Link slot="left" href="/settings/">
          Setting
        </Link>
      </Navbar>

      <Messagebar
        value={messageText}
        onInput={(e) => setMessageText(e.target.value)}
      >
        <Link slot="inner-end" onClick={sendMessage}>
          Send
        </Link>
      </Messagebar>

      <Messages>
        <MessagesTitle>
          Temperature: {temperature}, Context: {context}
        </MessagesTitle>

        {messagesData.map((message, index) => (
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
