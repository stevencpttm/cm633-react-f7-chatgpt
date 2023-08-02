import {
  Page,
  Navbar,
  Link,
  Block,
  List,
  ListItem,
  f7,
  useStore,
} from "framework7-react";

const ConversationPage = () => {
  const temperature = useStore("temperature");
  const context = useStore("context");
  const conversations = useStore("conversations");

  const setTemperature = (value) => {
    f7.store.dispatch("setTemperature", value);
  };
  const setContext = (value) => {
    f7.store.dispatch("setContext", value);
  };

  return (
    <>
      <Page>
        <Navbar title="Conversation">
          <Link slot="right">Create</Link>
        </Navbar>

        <List dividersIos mediaList outlineIos strongIos>
          {conversations.map((conversation) => (
            <ListItem
              key={conversation.id}
              link="#"
              title={conversation.name}
              subtitle={conversation.prompt}
              text={conversation.lastMessage}
            />
          ))}
        </List>
      </Page>
    </>
  );
};

export default ConversationPage;
