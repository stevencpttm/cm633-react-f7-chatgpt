import {
  Page,
  Navbar,
  Toolbar,
  Link,
  Block,
  Button,
  f7,
  useStore,
} from "framework7-react";

const HomePage = ({ f7router }) => {
  // const [count, setCount] = useState(0);
  const count = useStore("count");

  return (
    <>
      {/*  Initial Page */}
      <Page>
        {/* Top Navbar */}
        <Navbar title="Awesome App">
          <Link slot="left">Left Link</Link>
          <Link slot="right" href="/about/">
            About
          </Link>
        </Navbar>
        {/* Toolbar */}
        <Toolbar bottom>
          <Link>Link 1</Link>
          <Link>Link 2</Link>
        </Toolbar>

        <h2>Count: {count}</h2>
        <Button
          onClick={() => {
            f7.store.dispatch("setCount", count + 1);
          }}
        >
          Increment
        </Button>

        {/* Page Content */}
        {/* <Block>
          <p>Page content goes here</p>
          <Link href="/about/">Link to About App</Link>
        </Block>
        <Block>
          <p>Go to page by ID</p>
          <Link href="/single/1/">Go to ID: 1</Link>
        </Block>
        <Block>
          <p>Go to page by sending data</p>
          <Button
            onClick={() => {
              f7router.navigate("/data/", {
                props: {
                  title: "AAA",
                  content: "BBB",
                },
              });
            }}
          >
            Send title: AAA, content: BBB
          </Button>
        </Block> */}
      </Page>
    </>
  );
};

export default HomePage;
