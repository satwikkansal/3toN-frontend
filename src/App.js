import "./App.css";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Main from "./Main";
import LivePeerVideo from "./LivePeerVideo";

function App() {
  return (
    <div className="p-5 bg-[#111119] h-screen w-full">
      <Routes>
        <Route
          path="/"
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
