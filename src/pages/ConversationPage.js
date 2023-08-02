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
import { v4 as uuidv4 } from "uuid";

const ConversationPage = () => {
  const conversations = useStore("conversations");

  const createConversation = () => {
    f7.store.dispatch("setConversations", [
      ...conversations,
      {
        id: uuidv4(),
        name: "(Untitled)",
        prompt: "",
        temperature: 0.7,
        context: 6,
        lastMessage: "",
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <>
      <Page>
        <Navbar title="Conversation">
          <Link slot="right" onClick={createConversation}>
            Create
          </Link>
        </Navbar>

        <List dividersIos mediaList outlineIos strongIos>
          {conversations.map((conversation) => (
            <ListItem
              key={conversation.id}
              link={`/message/${conversation.id}/`}
              title={conversation.name}
              subtitle={conversation.prompt || "(prompt not set)"}
              text={conversation.lastMessage || "-"}
            />
          ))}
        </List>
      </Page>
    </>
  );
};

export default ConversationPage;
