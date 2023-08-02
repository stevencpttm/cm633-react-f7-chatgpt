import {
  Page,
  Navbar,
  Link,
  Block,
  List,
  ListInput,
  Range,
  ListItem,
  Stepper,
  f7,
  useStore,
  f7ready,
} from "framework7-react";
import { useState, useEffect } from "react";

const SettingPage = ({ id }) => {
  const [conversation, setConversation] = useState(null);
  const conversations = useStore("conversations");

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

  const updateConversationProperty = (property, value) => {
    const newConversations = [...conversations];
    const theConversation = newConversations.find((item) => {
      return item.id === id;
    });
    theConversation[property] = value;
    f7.store.dispatch("setConversations", newConversations);
  };

  return (
    <>
      <Page>
        <Navbar title="Settings" backLink="Back"></Navbar>
        <List strongIos dividersIos insetIos>
          <ListInput
            label="Name"
            type="text"
            placeholder="Conversation Name"
            clearButton
            value={conversation?.name || ""}
            onInput={(e) => {
              updateConversationProperty("name", e.target.value);
            }}
          />
          <ListInput
            label="Prompt"
            type="text"
            placeholder="Instruct your chatbot"
            clearButton
            value={conversation?.prompt || ""}
            onInput={(e) => {
              updateConversationProperty("prompt", e.target.value);
            }}
          />
          <ListInput
            label={`Temperature (${conversation?.temperature})`}
            input={false}
          >
            <Range
              slot="input"
              value={conversation?.temperature}
              onRangeChanged={(value) => {
                // setTemperature(+value.toFixed(1));
                updateConversationProperty("temperature", +value.toFixed(1));
              }}
              min={0.1}
              max={2}
              step={0.1}
            />
          </ListInput>
          <ListItem title="Context">
            <Stepper
              min={2}
              max={20}
              step={1}
              small
              raised
              slot="after"
              value={conversation?.context}
              onStepperChange={(value) => {
                // setContext(+value);
                updateConversationProperty("context", +value);
              }}
            />
          </ListItem>
        </List>
      </Page>
    </>
  );
};

export default SettingPage;
