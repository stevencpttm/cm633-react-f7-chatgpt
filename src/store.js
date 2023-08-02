import { createStore } from "framework7/lite";

// Define States
let state = {
  conversations: [],
  messagesData: [],
  // temperature: 0.7,
  // context: 6,
};

// Define Getters
const getters = {
  conversations({ state }) {
    return state.conversations;
  },
  messagesData({ state }) {
    return state.messagesData;
  },
  // temperature({ state }) {
  //   return state.temperature;
  // },
  // context({ state }) {
  //   return state.context;
  // },
};

// Define Actions
const actions = {
  setConversations({ state }, newValue) {
    state.conversations = newValue;
  },
  setMessagesData({ state }, newValue) {
    state.messagesData = newValue;
  },
  // setTemperature({ state }, newValue) {
  //   state.temperature = newValue;
  // },
  // setContext({ state }, newValue) {
  //   state.context = newValue;
  // },
};

if (typeof window !== "undefined") {
  const savedState = window.localStorage.getItem("state");

  if (savedState) {
    const savedStateObject = JSON.parse(savedState);

    const shapeOfCurrentState = Object.keys(state);
    const shapeOfSavedState = Object.keys(savedStateObject);

    if (
      shapeOfSavedState.length === shapeOfSavedState.length &&
      shapeOfCurrentState.every((key) => shapeOfSavedState.includes(key))
    ) {
      state = savedStateObject;
    } else {
      console.log(`store shape changed!`);
      window.localStorage.removeItem("state");
    }
  }
}

const store = createStore({
  state,
  getters,
  actions,
});

store.state = new Proxy(store.state, {
  set(obj, prop, value) {
    obj[prop] = value;

    // save to localStorage
    if (typeof window !== "undefined") {
      const currentState = JSON.stringify(store.state);
      window.localStorage.setItem("state", currentState);
    }

    return true;
  },
});

export default store;
