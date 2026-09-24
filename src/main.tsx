import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import { persistor, store } from "./redux/store";
import { PageLoader } from "./components/common/PageLoader";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    {/* Hold rendering until the session is restored so guards don't bounce signed-in users to /auth. */}
    <PersistGate loading={<PageLoader />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
