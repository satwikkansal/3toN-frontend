import {
  Button,
  Collapse,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import React, {
  useEffect,
} from "react";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import Moment from "react-moment";
function ChatContent({
  message,
  id,
  send,
  senderAddress,
  ownerAddress,
}) {
  const [show, setShow] =
    useState(false);

  const handleToggle = () =>
    setShow(!show);

  return (
    <div
      className={`bg-white rounded-md mb-3`}
      key={id}
    >
      {ownerAddress ===
        senderAddress && (
        <div className="absolute top-5 left-3 -rotate-45">
          <FaCrown className="text-lg text-yellow-600" />
        </div>
      )}
      <div className="flex items-center p-3 space-x-3 flex-1 relative">
        <div className="flex-[0.2]">
          <img
            src={`https://www.gravatar.com/avatar/${senderAddress}?default=wavatar`}
            className="w-12 h-12 rounded-full object-cover absolute top-5"
          />
        </div>
        <div className="w-full flex-[0.8]">
          <h1 className="text-lg font-extrabold break-all">
            {senderAddress}
          </h1>

          <div className="bg-superlive_light_blue w-full p-3 rounded-lg shadow-lg relative">
            {message?.length > 38 && (
              <div className="absolute top-2 right-3">
                <MdKeyboardArrowDown
                  className={`hover:cursor-pointer ${
                    show &&
                    "rotate-180 transition-all duration-300 ease-linear"
                  }`}
                  onClick={handleToggle}
                />
              </div>
            )}
            <Collapse
              startingHeight={20}
              in={show}
              className="w-full mt-3"
            >
              <p
                className={`leading-[17px] text-base font-semibold ${
                  show &&
                  "leading-[22px]"
                }`}
              >
                {message}
              </p>
            </Collapse>
          </div>
          <div className="flex items-center justify-end mr-2">
            <Moment fromNow>
              {send}
            </Moment>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContent;
