import React, {
  useRef,
  useEffect,
} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

function VideoJs(url) {
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
        width="600"
        height="300"
        className="video-js vjs-default-skin"
        controls
        ref={videoRef}
      >
        <source
          src={url}
          type="application/x-mpegURL"
        ></source>
      </video>
    </div>
  );
}

export default VideoJs;
