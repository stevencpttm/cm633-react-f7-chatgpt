import {
  Page,
  Navbar,
  Link,
  Block,
  List,
  ListInput,
  Range,
  f7,
  useStore,
} from "framework7-react";
import { useState } from "react";

const SettingPage = () => {
  // const [temperature, setTemperature] = useState(0.7);
  const temperature = useStore("temperature");
  const setTemperature = (value) => {
    f7.store.dispatch("setTemperature", value);
  };

  return (
    <>
      <Page>
        <Navbar title="Settings" backLink="Back"></Navbar>
        <List strongIos dividersIos insetIos>
          <ListInput label={`Temperature (${temperature})`} input={false}>
            <Range
              slot="input"
              value={temperature}
              onRangeChanged={(value) => {
                setTemperature(+value.toFixed(1));
              }}
              min={0.1}
              max={2}
              step={0.1}
            />
          </ListInput>
        </List>
      </Page>
    </>
  );
};

export default SettingPage;
