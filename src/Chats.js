import {
  Button,
  Input,
} from "@chakra-ui/react";
import React from "react";
import ChatContent from "./ChatContent";
import {
  AiOutlinePicture,
  AiOutlinePaperClip,
  AiOutlineEye,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";

function Chats() {
  return (
    <div className="flex-[0.3]">
      <div className="flex bg-superlive_blue items-center justify-between space-x-3 mb-2 rounded-lg p-2 mt-3">
        <div className="flex items-center justify-center bg-superlive_light_blue h-20 w-full rounded-lg">
          <h1 className="text-3xl font-extrabold">
            💸 17.77
          </h1>
        </div>
        <div className="w-full space-y-2">
          <div className="flex items-center justify-center bg-superlive_light_blue h-9 w-full rounded-lg space-x-2 text-xl font-extrabold">
            <AiOutlineEye className="text-gray-600" />
            <h1>3 Views</h1>
          </div>
          <div className="flex items-center justify-center bg-superlive_light_blue h-9 w-full rounded-lg space-x-2 text-xl font-extrabold">
            <AiOutlineClockCircle className="text-gray-600" />
            <h1>13m 14s</h1>
          </div>
        </div>
      </div>
      <div className="overflow-y-scroll h-[51%] bg-[#333333] rounded-lg p-2 no-scrollbar space-y-3 fixed top-48 mr-4">
        <ChatContent
          message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
          num={3}
        />
        <ChatContent
          message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop "
          num={3}
        />
        <ChatContent
          message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not "
          num={3}
        />
        <ChatContent
          message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not "
          num={3}
        />
        <ChatContent
          message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not "
          num={24}
        />
      </div>
      <div className="z-[9999] bg-[#333333] p-2 fixed bottom-0 w-[29.3%] rounded-t-lg">
        <Input
          size="lg"
          variant="filled"
          placeholder="Type message..."
          className="mt-2"
        />
        <div className="flex items-center justify-between mb-2 mt-2">
          <div className="flex space-x-5 text-xl text-white">
            <div className="flex space-x-2">
              <AiOutlinePicture className="transition-all duration-300 ease-linear hover:text-pink-400 hover:cursor-pointer" />
              <AiOutlinePaperClip className="transition-all duration-300 ease-linear hover:text-green-500 hover:cursor-pointer" />
            </div>
            <BsEmojiSmile className="transition-all duration-300 ease-linear hover:text-yellow-600 hover:cursor-pointer" />
          </div>
          <Button
            rightIcon={<IoSend />}
            bg="#246BFD"
            color="#ffffff"
            className="hover:text-black"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Chats;
