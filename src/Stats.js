import React from "react";
import {
  AiOutlineEye,
  AiOutlineClockCircle,
} from "react-icons/ai";

import Moment from "react-moment";
import moment from 'moment';

function Stats({ views, expenses, earnings, startEpoch }) {
  return (
    <div className="flex bg-superlive_blue items-center justify-between space-x-3 mb-2 rounded-lg p-2 mt-3">
      <div className="flex items-center justify-center bg-superlive_light_blue h-20 w-full rounded-lg">
        <h1 className="text-3xl font-extrabold">
          💸 {expenses} $
        </h1>
      </div>
      <div className="w-full space-y-2">
        <div className="flex items-center justify-center bg-superlive_light_blue h-9 w-full rounded-lg space-x-2 text-xl font-extrabold">
          <AiOutlineEye className="text-gray-600" />
          <h1>{views} Views</h1>
        </div>
        <div className="flex items-center justify-center bg-superlive_light_blue h-9 w-full rounded-lg space-x-2 text-xl font-extrabold">
          <AiOutlineClockCircle className="text-gray-600" />
          <h1>{startEpoch}</h1>
        </div>
      </div>
    </div>
  );
}

export default Stats;
