import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";

import { checkSession } from "./store/userSlice.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.js";

// Dispatch session check on app load
store.dispatch(checkSession());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<p>loading.....</p>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
