import { useEffect, useState } from "react";
import config from "../config";
import "./Rooms.css";
import { GameLevel, RoomState } from "../types/types";
import { useNavigate } from "react-router";
import { removeQuotes } from "../utils/utils";
import Header from "../components/Header";
import CreateRoomModal from "./CreateRoomModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import RoomList from "./room-list/RoomList";

function Rooms() {
  const navigate = useNavigate();
  const [showCreateRoomModal, setShowCreateRoomModal] =
    useState<boolean>(false);

  const [rooms, setRooms] = useState<RoomState[]>([]);

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

  const getRoomList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated?");
      return;
    }
    try {
      const response = await fetch(
        `http://${config.serverHost}:${config.serverPort}/game/rooms`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const roomsList = (await response.json()) as RoomState[];
        setRooms(roomsList);
        console.log(roomsList);
      } else {
        console.error("Failed to get room list");
      }
    } catch (error) {
      console.error("Error getting room list:", error);
    }
  };

  useEffect(() => {
    getRoomList();
  }, []);

  const joinRoom = (room: RoomState) => {
    navigate(`/rooms/${room.level}/${room.id}`);
  };

  return (
    /* TODO: Somehow to show the leaderboard of the user and for each level
     * TODO: Error handling
     */
    <div className="game-container">
      <Header hasBackButton={false} />
      {showCreateRoomModal && (
        <CreateRoomModal onClose={cancelCreateRoom} onCreate={createNewRoom} />
      )}

      <div className="rooms">
        <div className="rooms-header">
          <button className="new-room-button" onClick={handleNewRoom}>
            <span>New Room</span>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <RoomList data={rooms} onClick={joinRoom} />
      </div>
    </div>
  );
}

export default Rooms;
