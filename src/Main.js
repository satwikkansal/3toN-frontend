import React from "react";
import { Client } from "@livepeer/webrtmp-sdk";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import config from "./config/config";
import {
  Contract,
  ethers,
} from "ethers";
import abi from "./abi/SuperliveAbi.json";

function Main() {
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

  const [streamName, setStreamName] =
    useState("");
  const [
    paymentTokenAddress,
    setPaymentTokenAddress,
  ] = useState("");
  const [
    perSecondCost,
    setPerSecondCost,
  ] = useState(0);

  const onButtonClick = async () => {
    setLoading(true);
    try {
      await axios
        .post(
          "https://livepeer.com/api/stream",
          {
            name: `${streamName}`,
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
          console.log(response);
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
                  localStorage.setItem(
                    "playBackId",
                    response?.data
                      ?.playbackId
                  );
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
  }

  const provider =
    new ethers.providers.Web3Provider(
      window.ethereum
    );

  const signer = provider.getSigner();

  const SuperLiveContract =
    new ethers.Contract(
      process.env.REACT_APP_F5LABS_LIVE_PEER_SMART_CONTRACT_ADDRESS,
      abi,
      signer
    );

  async function startStream(
    streamId,
    contract,
    rate,
    fDaiXAddress
  ) {
    // needs to be called with stream owner wallet.
    // streamId: Unique ID of the string
    // contract: The SuperLive contract instance
    // paymentTokenAddress: Contract Address of Payment super token
    // perSecondRate: Per second cost of the stream charged by creator

    // start stream
    let startTxn = await contract.start(
      streamId,
      rate,
      fDaiXAddress
    );
    let startTxnReceipt =
      await startTxn.wait();
    // check status
    let isLive =
      await contract.isStreamLive(
        streamId
      );
    return isLive;
  }

  const big = BigInt(
    Number(
      Number(perSecondCost) * 10 ** 18
    )
  );

  return (
    <>
      {" "}
      <video
        className="rounded-2xl mx-auto xl:w-1/3 w-3/4"
        ref={videoEl}
      />
      <div className="flex flex-col items-center p-3">
        <input
          type="text"
          className="w-1/3 p-2 rounded-md focus:outline-none"
          placeholder="Enter your stream name"
          onChange={(e) =>
            setStreamName(
              e.target.value
            )
          }
        />
        <input
          value={perSecondCost}
          type="number"
          className="w-1/3 p-2 rounded-md focus:outline-none mt-3"
          placeholder="Enter your Per second cost of the stream you want to charged"
          onChange={(e) =>
            setPerSecondCost(
              e.target.value
            )
          }
        />
        <label
          htmlFor="paymentTokenAddress"
          className="text-white text-lg mt-3 mb-2"
        >
          Please Select
          PaymentTokenAddress
        </label>
        <select
          name="PaymentTokenAddress"
          id="paymentTokenAddress"
          onChange={(e) => {
            setPaymentTokenAddress(
              e.target.value
            );
          }}
        >
          <option value="fDAIx">
            FDAIx
          </option>
          <option value="fUSDCx">
            FUSDCx
          </option>
          <option value="fTUSDx">
            FTUSDx
          </option>
        </select>
        <div className="flex items-center space-x-4 mt-4 ml-2 justify-center">
          {" "}
          <button
            className="p-2 bg-green-500 rounded-lg px-5 text-xl font-extrabold text-white"
            onClick={() => {
              onButtonClick();
              startStream(
                playBack,
                SuperLiveContract,
                big,
                config.goerli
                  .paymentTokens.fDAIx
              );
            }}
            disabled={
              streamName === "" ||
              perSecondCost === 0
            }
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
    </>
  );
}

export default Main;
