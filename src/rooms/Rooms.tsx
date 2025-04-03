import { useState } from "react";
import config from "../config";
import "./Rooms.css";
import { GameLevel } from "../types/types";
import { useNavigate } from "react-router";
import { removeQuotes } from "../utils/utils";
import Header from "../components/Header";
import CreateRoomModal from "./CreateRoomModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Rooms() {
  const navigate = useNavigate();
  const [showCreateRoomModal, setShowCreateRoomModal] =
    useState<boolean>(false);

  const handleNewRoom = () => {
    setShowCreateRoomModal(true);
  };

  const cancelCreateRoom = () => {
    setShowCreateRoomModal(false);
  };

  const createNewRoom = async (
    requiredPlayers: number,
    gameLevel: GameLevel
  ) => {
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
        navigate(`/rooms/${gameLevel}/${removeQuotes(roomId)}`);
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
     * TODO: Error handling
     */
    <div className="game-container">
      <Header />
      <div className="rooms">
        <h1>Rooms</h1>
        <button className="new-room-button" onClick={handleNewRoom}>
          <span>New Room</span>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        {showCreateRoomModal && (
          <CreateRoomModal
            onClose={cancelCreateRoom}
            onCreate={createNewRoom}
          />
        )}
      </div>
    </div>
  );
}

export default Rooms;
