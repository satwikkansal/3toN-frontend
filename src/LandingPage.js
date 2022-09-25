import React from "react";
import Header from "./Header";
import {
  BsFillCameraVideoFill,
  BsCollectionPlayFill,
} from "react-icons/bs";
function LandingPage() {
  return (
    <div>
      <Header />
      <div class="relative max-w-6xl mx-auto pt-16 sm:pt-20 lg:pt-28">
        <h1 class="superlive-heading font-extrabold text-4xl sm:text-5xl lg:text-8xl tracking-tight text-center">
          Welcome To{" "}
          {process.env.REACT_APP_NAME}
        </h1>
        <p class="mt-10 text-lg text-white font-bold text-center max-w-3xl mx-auto dark:text-slate-400">
          Create permissionless video streams and earn revenue for precise watch-time.
        </p>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-8 mt-20 ">
          <div className="bg-superlive_blue w-48 h-24 rounded-lg text-lg text-white font-bold flex items-center justify-center p-4 hover:cursor-pointer transition-all duration-300 ease-linear hover:opacity-80">
            <div className="flex space-x-4">
              <h1>Watch streams</h1>
              <BsCollectionPlayFill className="mt-1.5" />
            </div>
          </div>
          <div className="bg-white w-48 h-24 rounded-lg text-lg text-superlive_gray_text font-bold flex items-center justify-center p-4 hover:cursor-pointer transition-all duration-300 ease-linear hover:opacity-80">
            <div className="flex space-x-4">
              <h1>Create stream</h1>
              <BsFillCameraVideoFill className="mt-1.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
