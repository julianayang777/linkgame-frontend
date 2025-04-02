import { useState } from "react";
import config from "../config";
import "./Rooms.css";
import { GameLevel } from "../types/types";
import { useNavigate } from "react-router";
import { removeQuotes } from "../utils/utils";

function Rooms() {
  const navigate = useNavigate();
  const [requiredPlayers, setRequiredPlayers] = useState<number>(1);
  const [gameLevel, setGameLevel] = useState<GameLevel>(GameLevel.EASY);

  const handleNewRoom = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated?");
      return;
    }
    try {
      const response = await fetch(
        `http://${config.serverHost}:${config.serverPort}/game/create/${requiredPlayers}/${gameLevel}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const roomId = await response.text();
        console.log(`New room created: ${roomId}`);
        navigate(`/room/${GameLevel.EASY}/${removeQuotes(roomId)}`);
      } else {
        console.error("Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    /* TODO: Table with the list of rooms
     * TODO: Each room should have game-level, game-state, number of players, button to join the room
     * TODO: Somehow to show the leaderboard of the user and for each level
     * TODO: Should have an input to know how many players should be in the room and the level
     */
    <div className="container">
      <h1>Rooms</h1>
      <button className="new-room-button" onClick={handleNewRoom}>
        New Room
      </button>
    </div>
  );
}

export default Rooms;
