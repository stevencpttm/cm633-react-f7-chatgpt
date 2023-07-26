import { createStore } from "framework7/lite";

// Define States
let state = {
  messagesData: [],
  temperature: 0.7,
};

// Define Getters
const getters = {
  messagesData({ state }) {
    return state.messagesData;
  },
};

// Define Actions
const actions = {
  setMessagesData({ state }, newValue) {
    state.messagesData = newValue;
  },
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
