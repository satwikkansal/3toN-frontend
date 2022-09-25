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
  BigNumber,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";

import {
  MdContentCopy,
  MdSettings,
} from "react-icons/md";
import { FaShareSquare } from "react-icons/fa";
import {
  BsCameraVideo,
  BsCameraVideoFill,
  BsFillMicFill,
} from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import Chats from "./Chats";

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

  /*const big = BigInt(
    Number(
      Number(perSecondCost) * 10 ** 18
    )
  );*/

  const rate = BigNumber.from(10)
    .pow(18)
    .mul(Number(perSecondCost))
    .div(3600);

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
            rate,
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
  const [
    ContractgetStreamData,
    setContractGetStreamData,
  ] = useState([]);

  const [address, setAddress] = useState("");

  async function getStreamData(
    streamid,
    contract
  ) {
    let getdata =
      await contract.getStreamData(
        streamid
      );
    setContractGetStreamData(getdata);
  }

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
      getStreamData(streamId, contract);
      setAddress(ContractgetStreamData.owner)
    }
    // check status
    let isLive =
      await contract.isStreamLive(
        streamId
      );

    return isLive;
  }
  const format = (val) => `$` + val;
  const parse = (val) =>
    val.replace(/^\$/, "");
  const { isOpen, onOpen, onClose } =
    useDisclosure();

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Advanced configurations
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>
                Max Participants
              </FormLabel>
              <NumberInput
                defaultValue={1000}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormLabel>
                Max Duration
              </FormLabel>
              <NumberInput
                defaultValue={120}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormLabel>
                Free Preview
              </FormLabel>
              <NumberInput
                defaultValue={5}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              bg="#246BFD"
              color="white"
              className="hover:text-black"
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Header />
      <div className="flex flex-1">
        <div className="flex-[0.7]">
          <div className="relative ">
            <video
              className="rounded-2xl mx-auto mt-3 shadow-lg"
              ref={videoEl}
              width="600px"
              height="300px"
            />
            {live ? (
              <div className="absolute text-white text-xs font-bold top-2 right-[6rem] xl:right-[15rem] bg-black/60 p-0.5 w-14 rounded-lg">
                🟢 Live
              </div>
            ) : (
              <div className="absolute flex items-center text-white text-xs font-bold top-2 right-[6rem] xl:right-[15rem] bg-black/60 p-0.5 px-2 w-auto rounded-lg space-x-1">
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
            <div className="xl:w-[57%] w-[80%] flex items-center space-x-2 mx-auto mt-2 bg-white p-2 rounded-lg">
              <Tooltip
                label="Enter per hour amount"
                hasArrow
              >
                <NumberInput
                  value={format(
                    perSecondCost
                  )}
                  min={0}
                  onChange={(e) =>
                    setPerSecondCost(
                      parse(e)
                    )
                  }
                  className="w-full font-extrabold text-superlive_gray_input_text text-lg"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Tooltip>
              <Select
                icon={
                  <IoMdArrowDropdown />
                }
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
            <div className="xl:w-[57%] w-[80%] flex items-center space-x-2 mx-auto mt-2 bg-white p-2 rounded-lg">
              <Input
                placeholder="Enter your live stream name"
                variant="filled"
                bg="#D6D6D6"
                className="placeholder:text-superlive_gray_input_text placeholder:font-extrabold placeholder:text-lg text-lg text-superlive_gray_input_text font-extrabold"
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
                  paymentTokenAddress ===
                    ""
                }
                className="bg-superlive_blue text-white font-extrabold text-sm p-1 w-40 h-10 rounded-md transition-all duration-300 ease-linear hover:bg-green-500  hover:cursor-pointer disabled:cursor-not-allowed"
              >
                Go Live
              </button>
              <div className="bg-superlive_light_blue w-1/2 xl:w-[30%] flex items-center space-x-2 h-10 rounded-md p-2">
                <Tooltip
                  label="off Video"
                  hasArrow
                >
                  <div className="w-10 h-10 rounded-3xl flex items-center justify-center bg-superlive_blue text-white transition-all duration-300 ease-linear hover:bg-red-500 hover:rounded-xl hover:cursor-pointer">
                    <BsCameraVideoFill />
                  </div>
                </Tooltip>
                <Tooltip
                  label="off Mic"
                  hasArrow
                >
                  <div className="w-10 h-10 rounded-3xl flex items-center justify-center bg-superlive_blue text-white transition-all duration-300 ease-linear hover:bg-red-500 hover:rounded-xl hover:cursor-pointer">
                    <BsFillMicFill />
                  </div>
                </Tooltip>
                <Tooltip
                  label="Advanced configurations"
                  hasArrow
                >
                  <div
                    className="w-10 h-10 rounded-3xl flex items-center justify-center bg-superlive_blue text-white transition-all duration-300 ease-linear hover:bg-red-500 hover:rounded-xl hover:cursor-pointer"
                    onClick={onOpen}
                  >
                    <MdSettings />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-[0.3]">
          <Chats
            streamId={playBack}
            streamData={
              ContractgetStreamData
            }
            walletAddress={signer._address}
          />
        </div>
      </div>
    </div>
  );
}

export default Main;
