import React from "react";
import { VideoPlayer } from "@livepeer/react";

function LivePeerVideo({ playbackId }) {
  return (
    <VideoPlayer
      autoPlay
      loop
      muted
      playbackId={playbackId}
      width="600px"
      height="550px"
    />
  );
}

export default LivePeerVideo;
