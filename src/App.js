import "./App.css";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Main from "./Main";
import LivePeerVideo from "./LivePeerVideo";
import LandingPage from "./LandingPage";

function App() {
  return (
    <div className="bg-[#111119] h-screen w-full p-4">
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/create-stream"
          element={<Main />}
        />
        <Route
          path="/join/:id"
          element={<LivePeerVideo />}
        />
      </Routes>
    </div>
  );
}

export default App;
