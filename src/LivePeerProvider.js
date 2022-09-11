import React from "react";
import {
  createReactClient,
  LivepeerConfig,
} from "@livepeer/react";
import { studioProvider } from "livepeer/providers/studio";
import LivePeerVideo from "./LivePeerVideo";

const client = createReactClient({
  provider: studioProvider({
    apiKey:
      process.env
        .REACT_APP_F5LABS_LIVE_PEER_API_KEY,
  }),
});

function LivePeerProvider({
  playbackId,
}) {
  return (
    <LivepeerConfig client={client}>
      <LivePeerVideo />
    </LivepeerConfig>
  );
}

export default LivePeerProvider;
