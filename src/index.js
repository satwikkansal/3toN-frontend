import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  createReactClient,
  LivepeerConfig,
} from "@livepeer/react";
import { studioProvider } from "livepeer/providers/studio";

const client = createReactClient({
  provider: studioProvider({
    apiKey:
      process.env
        .REACT_APP_F5LABS_LIVE_PEER_API_KEY,
  }),
});

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <LivepeerConfig client={client}>
      <App />
    </LivepeerConfig>
  </BrowserRouter>
);
