import "./App.css";
import { Client } from "@livepeer/webrtmp-sdk";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import VideoJs from "./VideoJs";
import videojs from "video.js";
import LivePeerProvider from "./LivePeerProvider";
function App() {
  const videoEl = useRef(null);
  const stream = useRef(null);

  useEffect(() => {
    (async () => {
      videoEl.current.volume = 0;

      stream.current =
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
            audio: true,
          }
        );

      videoEl.current.srcObject =
        stream.current;
      videoEl.current.play();
    })();
  }, []);

  /*const startStream = async () => {
    videoEl.current.volume = 0;

    stream.current =
      await navigator.mediaDevices.getUserMedia(
        {
          video: true,
          audio: true,
        }
      );

    videoEl.current.srcObject =
      stream.current;
    videoEl.current.play();
  };*/

  const [loading, setLoading] =
    useState(false);
  const [live, setLive] =
    useState(false);
  const [playBack, setPlayback] =
    useState("");

  const onButtonClick = async () => {
    setLoading(true);
    try {
      await axios
        .post(
          "https://livepeer.com/api/stream",
          {
            name: "first stream",
          },
          {
            headers: {
              "content-type":
                "application/json",
              authorization: `Bearer ${process.env.REACT_APP_F5LABS_LIVE_PEER_API_KEY}`,
            },
          }
        )
        .then((response) => {
          setLive(true);

          setLoading(false);
          if (!stream.current) {
            alert(
              "Video stream was not started."
            );
          }

          if (
            !response?.data?.streamKey
          ) {
            alert(
              "Invalid response?.data?.streamKey."
            );
            return;
          }

          const getDetails =
            async () => {
              await axios
                .get(
                  `https://livepeer.com/api/stream/${response?.data?.id}`,
                  {
                    headers: {
                      "content-type":
                        "application/json",
                      authorization: `Bearer ${process.env.REACT_APP_F5LABS_LIVE_PEER_API_KEY}`, // API Key needs to be passed as a header
                    },
                  }
                )
                .then((response) => {
                  console.log(response);
                  setPlayback(
                    response?.data
                      ?.playbackId
                  );
                })
                .catch((error) => {
                  console.log(error);
                });
            };

          getDetails();

          const client = new Client();

          const session = client.cast(
            stream.current,
            response?.data?.streamKey
          );
          session.on("open", () => {
            console.log(
              "Stream started."
            );
            alert(
              "Stream started; visit Livepeer Dashboard."
            );
          });

          session.on("close", () => {
            console.log(
              "Stream stopped."
            );
            setLive(false);
          });
          session.on("error", (err) => {
            console.log(
              "Stream error.",
              err.message
            );
          });
        });
    } catch (e) {
      console.error(e);
    }
  };

  function stopBothVideoAndAudio(
    stream
  ) {
    stream
      .getTracks()
      .forEach((track) => track.stop());
    setLive(false);
    videoEl.current.srcObject = null;
  }
  console.log(
    `https://livepeercdn.com/hls/${playBack}/index.m3u8`
  );
  return (
    <div className="p-5 bg-[#111119] h-screen w-full">
      <video
        className="rounded-2xl mx-auto xl:w-1/2 w-3/4"
        ref={videoEl}
      />
      {playBack && (
        <VideoJs
          url={`https://livepeercdn.com/hls/${playBack}/index.m3u8`}
        />
      )}
      <div className="flex items-center space-x-4 mt-4 ml-2 justify-center">
        <button
          className="p-2 bg-green-500 rounded-lg px-5 text-xl font-extrabold text-white"
          onClick={() => {
            onButtonClick();
          }}
        >
          Start
        </button>
        <button
          className="p-2 px-5 bg-red-500 rounded-lg text-xl font-extrabold text-white"
          onClick={() => {
            stopBothVideoAndAudio(
              stream.current
            );
          }}
        >
          Stop
        </button>
        <div
          className={`rounded-lg ${
            live
              ? "bg-green-400"
              : "bg-slate-600"
          } p-2 px-5`}
        >
          {loading && (
            <h1>Loading...</h1>
          )}

          {live ? (
            <h1 className="text-white text-xl font-extrabold">
              Live
            </h1>
          ) : (
            <h1 className="text-white text-xl font-extrabold">
              Offline
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
