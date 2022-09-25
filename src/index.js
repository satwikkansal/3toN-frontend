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
import { ChakraProvider } from "@chakra-ui/react";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } =
  configureChains(
    [chain.polygon, chain.optimism, chain.goerli],
    [publicProvider()]
  );

const { connectors } =
  getDefaultWallets({
    appName: "SuperLive",
    chains,
  });

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

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
  <ChakraProvider>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
      >
        <BrowserRouter>
          <LivepeerConfig
            client={client}
          >
            <App />
          </LivepeerConfig>
        </BrowserRouter>
      </RainbowKitProvider>
    </WagmiConfig>
  </ChakraProvider>
);
