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
} from "framework7-react";
import { useState } from "react";

const SettingPage = () => {
  // const [temperature, setTemperature] = useState(0.7);
  const temperature = useStore("temperature");
  const context = useStore("context");

  const setTemperature = (value) => {
    f7.store.dispatch("setTemperature", value);
  };
  const setContext = (value) => {
    f7.store.dispatch("setContext", value);
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
          <ListItem title="Context">
            <Stepper
              min={2}
              max={20}
              step={1}
              small
              raised
              slot="after"
              value={context}
              onStepperChange={(value) => {
                setContext(+value);
              }}
            />
          </ListItem>
        </List>
      </Page>
    </>
  );
};

export default SettingPage;
