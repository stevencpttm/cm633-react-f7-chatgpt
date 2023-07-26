import { Page, Navbar, Link, Block, Toolbar, f7ready } from "framework7-react";
import { useEffect } from "react";

const DataPage = ({ title, content, f7router }) => {
  useEffect(() => {
    // componentDidMount
    f7ready((f7) => {
      // f7ready
      if (!title || !content) {
        f7.dialog.alert("No title or content is provided", "Error", () => {
          // when user clicked the confirm button
          f7router.back();
        });
      }
    });
  }, []);

  return (
    <>
      <Page>
        <Navbar title="Single Page" backLink="Back"></Navbar>
        <Block>
          <p>Title: {title}</p>
          <p>Content: {content}</p>
        </Block>
      </Page>
    </>
  );
};

export default DataPage;
