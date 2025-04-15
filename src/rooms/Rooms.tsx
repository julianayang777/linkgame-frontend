import { useEffect, useState } from "react";
import config from "../config";
import "./Rooms.css";
import {
  ErrorMessage,
  GameLevel,
  Leaderboard,
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
import LeaderboardModal from "./leaderboard/LeaderboardModal";

function Rooms() {
  const navigate = useNavigate();
  const [showCreateRoomModal, setShowCreateRoomModal] =
    useState<boolean>(false);
  const [createRoomModalError, setCreateRoomModalError] = useState<string>("");

  const [showLeaderboardModal, setShowLeaderboardModal] =
    useState<boolean>(false);
  const [leaderboardError, setLeaderboardError] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);

  const [rooms, setRooms] = useState<RoomState[]>([]);
  const [error, setError] = useState<string>("");
  const [filterAvailable, setfilterAvailable] = useState<boolean>(false);

  const handleNewRoom = () => {
    setShowCreateRoomModal(true);
  };

  const cancelCreateRoom = () => {
    setShowCreateRoomModal(false);
  };

  const handleLeaderboard = () => {
    setShowLeaderboardModal(true);
    getLeaderboard(GameLevel.EASY);
  };

  const cancelLeaderboard = () => {
    setShowLeaderboardModal(false);
  };

  const createNewRoom = async (
    requiredPlayers: number,
    gameLevel: GameLevel
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated?");
      setCreateRoomModalError(ErrorMessage.UserNotAuthenticated);
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
          setCreateRoomModalError(ErrorMessage.InvalidNumberOfPlayers);
        } else {
          setCreateRoomModalError(ErrorMessage.UnexpectedError);
        }
      }
    } catch (error) {
      console.error("Error creating room:", error);
      setCreateRoomModalError(ErrorMessage.ServerError);
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

  const getBestScore = async (level: GameLevel): Promise<number | null> => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated?");
      setLeaderboardError(ErrorMessage.UserNotAuthenticated);
      return null;
    }
    try {
      const response = await fetch(
        `http://${config.serverHost}:${config.serverPort}/leaderboard/player/best-scores`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data[level];
      } else if (response.status === 400) {
        const errorMessage = await response.text();
        console.error("[Error] Failed to get best score: ", errorMessage);
      }
    } catch (error) {
      console.error("Error getting best score:", error);
      setLeaderboardError(ErrorMessage.ServerError);
    }
    return null;
  };

  const getLeaderboard = async (level: GameLevel) => {
    try {
      const response = await fetch(
        `http://${config.serverHost}:${config.serverPort}/leaderboard/${level}/top/10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const bestScore = await getBestScore(level);
        const leaderboard = {
          level: level,
          playerBestScore: bestScore,
          topPlayers: data,
        };
        setLeaderboard(leaderboard);
        console.log("Leaderboard:", leaderboard);
      } else if (response.status === 400) {
        const errorMessage = await response.text();
        console.error("[Error] Failed to get leaderboard:", errorMessage);
      }
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      setLeaderboardError(ErrorMessage.ServerError);
    }
  };

  return (
    <div className="room-container">
      <Header
        hasBackButton={false}
        hasLeaderboardButton={true}
        onLeaderboardClick={handleLeaderboard}
      />
      <div className="room-content">
        {showCreateRoomModal && (
          <CreateRoomModal
            errorMessage={createRoomModalError}
            onClose={cancelCreateRoom}
            onCreate={createNewRoom}
          />
        )}

        {showLeaderboardModal && (
          <LeaderboardModal
            data={leaderboard!}
            errorMessage={leaderboardError}
            onLevelChange={(level: GameLevel) => getLeaderboard(level)}
            onClose={cancelLeaderboard}
          />
        )}

        {error && (
          <div className="error-message-container">
            <p className="error-message">{error}</p>
          </div>
        )}

        <div className="rooms">
          <div className="rooms-header">
            <button
              className="filter-available-button"
              onClick={() => setfilterAvailable(!filterAvailable)}
            >
              <span>{filterAvailable ? "Show All" : "Show Available"}</span>
            </button>
            <button className="new-room-button" onClick={handleNewRoom}>
              <span>New Room</span>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <RoomList
            data={rooms}
            onClick={joinRoom}
            filterAvailable={filterAvailable}
          />
        </div>
      </div>
    </div>
  );
}

export default Rooms;
