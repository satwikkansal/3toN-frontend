import {
  Button,
  Collapse,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

function ChatContent({ message, num }) {
  const [show, setShow] =
    useState(false);

  const handleToggle = () =>
    setShow(!show);
  return (
    <div
      className={`bg-white rounded-md mb-${num}`}
    >
      <div className="flex items-center p-3 space-x-3 flex-1 relative">
        <div className="flex-[0.2]">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-C7PEpg_KdP3ix-GO3C3DD1z0X726jo0lBQ&usqp=CAU"
            className="w-12 h-12 rounded-full object-cover absolute top-5"
          />
        </div>
        <div className="w-full flex-[0.8]">
          <h1 className="text-lg font-extrabold ">
            Vitalik
          </h1>
          <div className="bg-superlive_light_blue w-full p-3 rounded-lg shadow-lg relative">
            {message?.length > 21 && (
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
        </div>
      </div>
    </div>
  );
}

export default ChatContent;
