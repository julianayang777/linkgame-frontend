import { BrowserRouter, Route, Routes } from "react-router";
import MainPage from "./mainpage/MainPage";
import Rooms from "./rooms/Rooms";
import Game from "./game/Game";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:level/:roomId" element={<Game />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;