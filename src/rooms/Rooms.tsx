import { useEffect, useState } from "react";
import config from "../config";
import "./Rooms.css";
import {
  ErrorMessage,
  GameLevel,
  RoomState,
  ServerResponseError,
} from "../types/types";
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
  const [modalError, setModalError] = useState<string>("");

  const [rooms, setRooms] = useState<RoomState[]>([]);
  const [error, setError] = useState<string>("");

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
      setModalError(ErrorMessage.UserNotAuthenticated);
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
        navigate(`/rooms/${gameLevel}/${removeQuotes(roomId)}`);
      } else if (response.status === 400) {
        const errorMessage = await response.text();
        console.error("Error message:", errorMessage);
        if (
          removeQuotes(errorMessage) ===
            ServerResponseError.NumberPlayersNotInteger ||
          removeQuotes(errorMessage) ===
            ServerResponseError.NumberPlayersNotGreaterThanZero
        ) {
          setModalError(ErrorMessage.InvalidNumberOfPlayers);
        } else {
          setModalError(ErrorMessage.UnexpectedError);
        }
      }
    } catch (error) {
      console.error("Error creating room:", error);
      setModalError(ErrorMessage.ServerError);
    }
  };

  const getRoomList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated?");
      setError(ErrorMessage.UserNotAuthenticated);
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
      } else if (response.status === 400) {
        console.error("Failed to get room list");
        const errorMessage = await response.text();
        console.error("Error message:", errorMessage);
        if (errorMessage.includes(ServerResponseError.PlayerNotFound)) {
          setError(ErrorMessage.PlayerNotFound);
        } else {
          setError(ErrorMessage.UnexpectedError);
        }
      }
    } catch (error) {
      console.error("Error getting room list:", error);
      setError(ErrorMessage.ServerError);
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
     */
    <div className="room-container">
      <Header hasBackButton={false} />
      {showCreateRoomModal && (
        <CreateRoomModal
          errorMessage={modalError}
          onClose={cancelCreateRoom}
          onCreate={createNewRoom}
        />
      )}
      {error && (
        <div className="error-message-container">
          <p className="error-message">{error}</p>
        </div>
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
