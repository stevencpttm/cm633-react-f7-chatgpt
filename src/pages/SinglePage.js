import { Page, Navbar, Link, Block, Toolbar } from "framework7-react";

const SinglePage = ({ id }) => {
  return (
    <>
      <Page>
        <Navbar title="Single Page" backLink="Back"></Navbar>
        <Block>
          <p>The ID of this page is {id}</p>
        </Block>
      </Page>
    </>
  );
};

export default SinglePage;
