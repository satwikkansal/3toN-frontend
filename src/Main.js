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
import Header from "./Header";
import {
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Select,
  Tooltip,
  Skeleton,
} from "@chakra-ui/react";
import { MdContentCopy } from "react-icons/md";
import { FaShareSquare } from "react-icons/fa";
import {
  BsCameraVideo,
  BsCameraVideoFill,
  BsFillMicFill,
} from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";

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

  const [
    showStreamUrl,
    setShowStreamUrl,
  ] = useState("");
  const [
    streamUrlLoading,
    setStreamUrlLoading,
  ] = useState(true);

  const big = BigInt(
    Number(
      Number(perSecondCost) * 10 ** 18
    )
  );
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
          setPlayback(
            response?.data?.playbackId
          );
          setShowStreamUrl(
            `https://livepeercdn.com/hls/${response?.data?.playbackId}/index.m3u8`
          );
          startStream(
            response?.data?.playbackId,
            SuperLiveContract,
            big,
            config.goerli.paymentTokens[
              paymentTokenAddress
            ],
            streamName
          );
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

          const client = new Client();

          const session = client.cast(
            stream.current,
            response?.data?.streamKey
          );
          session.on("open", () => {
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

  /*const getDetails = async () => {
    await axios
      .get(
        `https://livepeer.com/api/stream/${livepeerStreamId}`,
        {
          headers: {
            "content-type":
              "application/json",
            authorization: `Bearer ${process.env.REACT_APP_F5LABS_LIVE_PEER_API_KEY}`, // API Key needs to be passed as a header
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setPlayback(
          response?.data?.playbackId
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };*/

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
  const [streamStart, setStreamStart] =
    useState(false);
  async function startStream(
    streamId,
    contract,
    rate,
    fDaiXAddress,
    StreamName
  ) {
    // needs to be called with stream owner wallet.
    // streamId: Unique ID of the string
    // contract: The SuperLive contract instance
    // paymentTokenAddress: Contract Address of Payment super token
    // perSecondRate: Per second cost of the stream charged by creator

    setStreamUrlLoading(true);
    setStreamStart(true);

    // start stream
    let startTxn = await contract.start(
      streamId,
      rate,
      fDaiXAddress,
      StreamName
    );
    let startTxnReceipt =
      await startTxn.wait();
    if (startTxnReceipt) {
      setStreamUrlLoading(false);
      setLive(true);
      setStreamStart(false);
    }
    // check status
    let isLive =
      await contract.isStreamLive(
        streamId
      );

    return isLive;
  }
  return (
    <div>
      <Header />
      <div className="relative ">
        <video
          className="rounded-2xl mx-auto xl:w-[40%] w-[85%] mt-7 shadow-lg"
          ref={videoEl}
        />
        {live ? (
          <div className="absolute text-white text-xs font-bold top-2 right-[29rem] bg-black/60 p-0.5 w-14 rounded-lg">
            🟢 Live
          </div>
        ) : (
          <div className="absolute flex items-center text-white text-xs font-bold top-2 right-[29rem] bg-black/60 p-0.5 px-2 w-auto rounded-lg space-x-1">
            <span className="loader"></span>
            <span className="mb-1 mr-2">
              {streamStart
                ? "Please wait we are waiting for transaction. "
                : "waiting to go live"}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="xl:w-[40%] w-[85%] flex items-center space-x-2 mx-auto mt-2 bg-white p-2 rounded-lg">
          <Tooltip
            label="Enter per second amount"
            hasArrow
          >
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="green.500"
                children="$"
                className="font-extrabold text-xs"
              />
              <Input
                placeholder="Amount"
                variant="filled"
                bg="#D6D6D6"
                className="placeholder:text-superlive_gray_input_text placeholder:font-extrabold placeholder:text-lg"
                type="number"
                onChange={(e) =>
                  setPerSecondCost(
                    e.target.value
                  )
                }
              />
            </InputGroup>
          </Tooltip>
          <Select
            icon={<IoMdArrowDropdown />}
            variant="filled"
            placeholder="Currency"
            bg="#D6D6D6"
            className="text-superlive_gray_input_text text-lg font-extrabold"
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
          </Select>

          <div className="bg-superlive_light_blue w-full flex items-center space-x-2 h-10 rounded-md p-2 transition-all duration-300 ease-linear">
            <Skeleton
              isLoaded={
                !streamUrlLoading
              }
            >
              <div className="w-40">
                <a
                  href={`${process.env.REACT_APP_DOMAIN_NAME}/join/${playBack}`}
                  target="_blank"
                >
                  <p className="text-xs text-blue-500 underline">
                    {`${process.env.REACT_APP_DOMAIN_NAME}/join/${playBack}`}
                  </p>
                </a>
              </div>
            </Skeleton>
            <div className="flex items-center space-x-2">
              <MdContentCopy className="text-blue-500 hover:cursor-pointer transition-all duration-300 ease-linear hover:text-gray-600" />
              <FaShareSquare className="text-blue-500 hover:cursor-pointer transition-all duration-300 ease-linear hover:text-gray-600" />
            </div>
          </div>
        </div>
        <div className="xl:w-[40%] w-[85%] flex items-center space-x-2 mx-auto mt-2 bg-white p-2 rounded-lg">
          <Input
            placeholder="Enter your live stream name"
            variant="filled"
            bg="#D6D6D6"
            className="placeholder:text-superlive_gray_input_text placeholder:font-extrabold placeholder:text-lg"
            type="text"
            onChange={(e) =>
              setStreamName(
                e.target.value
              )
            }
          />

          <button
            onClick={() => {
              onButtonClick();
            }}
            disabled={
              streamName === "" ||
              perSecondCost === 0 ||
              paymentTokenAddress === ""
            }
            className="bg-superlive_blue text-white font-extrabold text-sm p-1 w-40 h-10 rounded-md transition-all duration-300 ease-linear hover:bg-green-500  hover:cursor-pointer disabled:cursor-not-allowed"
          >
            Go Live
          </button>
          <div className="bg-superlive_light_blue w-1/2 xl:w-[25%] flex items-center space-x-2 h-10 rounded-md p-2">
            <div className="w-10 h-10 rounded-3xl flex items-center justify-center bg-superlive_blue text-white transition-all duration-300 ease-linear hover:bg-red-500 hover:rounded-xl hover:cursor-pointer">
              <BsCameraVideoFill />
            </div>
            <div className="w-10 h-10 rounded-3xl flex items-center justify-center bg-superlive_blue text-white transition-all duration-300 ease-linear hover:bg-red-500 hover:rounded-xl hover:cursor-pointer">
              <BsFillMicFill />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
