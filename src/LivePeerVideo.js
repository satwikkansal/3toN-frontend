import React from "react";
import { VideoPlayer } from "@livepeer/react";
const playbackId = "ae581ao8w0vlex0l";
function LivePeerVideo() {
  return (
    <VideoPlayer
      autoplay
      loop
      muted
      playbackId={playbackId}
    />
  );
}

export default LivePeerVideo;
