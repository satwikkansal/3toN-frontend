import React, {
  useRef,
  useEffect,
} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

function VideoJs({ url }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = videojs(
      videoRef.current
    );
    player.play();
    videojs.log("player is ready");
  }, []);
  return (
    <div data-vjs-player>
      <video
        id="my-video"
        className="video-js"
        controls
        preload="auto"
        width="640"
        height="264"
        data-setup="{}"
        ref={videoRef}
        src={url}
      >
        <source
          src={url}
          type="application/x-mpegURL"
        />
      </video>
    </div>
  );
}

export default VideoJs;
