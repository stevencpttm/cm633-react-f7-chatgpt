import { Page, Navbar, Link, Block, Toolbar } from "framework7-react";

const HomePage = () => {
  return (
    <>
      <Page>
        <Navbar title="About" backLink="Profile"></Navbar>
        <Block>
          <p>Page content goes here</p>
        </Block>
        <Toolbar bottom>
          <Link back>Back</Link>
        </Toolbar>
      </Page>
    </>
  );
};

export default HomePage;
