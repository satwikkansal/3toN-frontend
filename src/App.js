import "./App.css";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Main from "./Main";
import LivePeerVideo from "./LivePeerVideo";

function App() {
  const playbackId =
    localStorage.getItem("playBackId");
  return (
    <div className="p-5 bg-[#111119] h-screen w-full">
      <Routes>
        <Route
          path="/"
          element={<Main />}
        />
        <Route
          path="/join"
          element={
            <LivePeerVideo
              playbackId={playbackId}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
