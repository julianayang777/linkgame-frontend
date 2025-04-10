import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import {
  Board,
  Coordinate,
  ErrorMessage,
  Finished,
  GameState,
  ServerResponseError,
} from "../types/types";
import config from "../config";
import Tile from "./Tile";
import "./Game.css";
import Header from "../components/Header";
import { removeQuotes } from "../utils/utils";
import Awaiting from "./Awaiting";
import StartSoon from "./StartSoon";
import Win from "./Win";
import Lose from "./Lose";
import GameStateInfo from "./GameStateInfo";
import Path from "./Path";

function Game() {
  const { level, roomId } = useParams();
  const wsRef = useRef<WebSocket | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const TIMEOUT = 150;

  const [board, setBoard] = useState<Board | null>(null);
  const [tile1, setTile1] = useState<Coordinate | null>(null);
  const [tile2, setTile2] = useState<Coordinate | null>(null);
  const [path, setPath] = useState<Coordinate[]>([]);

  const [error, setError] = useState<string>("");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleStateUpdate = useCallback(
    (message: any, type: string): GameState | null => {
      const username = localStorage.getItem("username");
      switch (type) {
        case "AwaitingPlayers":
          return {
            type: "AwaitingPlayers",
            id: roomId!,
            level: message.gameLevel,
            joinedPlayers: message.players.length,
            requiredPlayers: message.requiredPlayers,
          };
        case "GameStartsSoon":
          return {
            type: "GameStartsSoon",
            id: roomId!,
            level: message.gameLevel,
            joinedPlayers: message.players,
            startIn: message.startIn,
          };
        case "InProgress":
          return {
            type: "InProgress",
            id: roomId!,
            level: message.gameLevel,
            playerBoards: message.playerBoards,
          };
        case "Win":
          return {
            type: username === message.winner.name ? "Win" : "Lose",
            id: roomId!,
            level: message.gameLevel,
            winner: message.winner,
            timeTaken: message.completionTime,
          };
        default:
          return null;
      }
    },
    [roomId]
  );

  const getGameStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      console.error("User not authenticated.");
      setError(ErrorMessage.UserNotAuthenticated);
      return;
    }

    try {
      const response = await fetch(
        `http://${config.serverHost}:${config.serverPort}/game/${roomId}/status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const gameStatus = await response.json();
        if (gameStatus.type === "Win") {
          const gameState: Finished = {
            type: "Finished",
            id: roomId!,
            level: gameStatus.gameLevel,
            winner: gameStatus.winner,
            timeTaken: gameStatus.completionTime,
          };
          setGameState(gameState);
          setShowInfo(true);
        } else {
          console.error("Game has not ended");
        }
      } else if (response.status === 404) {
        const errorMessage = await response.text();
        console.error("Error message:", errorMessage);
        const expectedError = ServerResponseError.RoomNotFound.replace(
          "{roomId}",
          roomId!
        );
        if (errorMessage === removeQuotes(expectedError)) {
          setError(ErrorMessage.RoomNotFound);
        } else {
          setError(ErrorMessage.UnexpectedError);
        }
      }
    } catch (e) {
      console.error("Error fetching game status:", e);
      setError(ErrorMessage.ServerError);
    }
  }, [roomId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      console.error("User not authenticated.");
      setError(ErrorMessage.UserNotAuthenticated);
      return;
    }

    const ws = new WebSocket(
      `ws://${config.serverHost}:${config.serverPort}/game/join/${roomId}?authToken=${token}`
    );

    ws.onopen = () => {
      console.debug("WebSocket connection opened");
      wsRef.current = ws;
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const state = handleStateUpdate(message, message.type);
        if (state) {
          setGameState(state);
          if (state.type === "InProgress") {
            setBoard((prevBoard) => {
              // When user refreshes the page, the board is null, so we need to set it
              if (prevBoard === null) {
                return message.playerBoards[username];
              }
              return prevBoard;
            });
          }
        } else if (message.points) {
          /* Response of Match Request */
          setPath(message.points);

          timeoutRef.current = setTimeout(() => {
            setTile1(null);
            setTile2(null);
            setPath([]);
            setGameState((prevState) => {
              if (prevState?.type === "InProgress") {
                setBoard(prevState.playerBoards[username]);
              } else {
                console.error(
                  "Game state is not InProgress, cannot update board"
                );
              }
              return prevState;
            });
          }, TIMEOUT);
        } else {
          /* Other errors */
          console.error("Unknown message type:", message.type);
          setError(ErrorMessage.UnexpectedError);
        }
      } catch {
        const message = event.data;
        if (message.includes(ServerResponseError.InvalidMatch)) {
          console.error("Invalid match message:", message);
          timeoutRef.current = setTimeout(() => {
            setTile1(null);
            setTile2(null);
          }, TIMEOUT);
        } else {
          console.error("Unknown message format:", message);
          setError(ErrorMessage.UnexpectedError);
        }
      }
    };

    ws.onerror = async () => {
      console.error("WebSocket error:", error);
      getGameStatus();
    };

    ws.onclose = (event) => {
      console.debug("WebSocket connection closed: ", event);
    };

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [roomId, handleStateUpdate, error, getGameStatus]);

  useEffect(() => {
    if (tile1 && tile2) {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const message = {
          type: "Match",
          p1: {
            row: tile1.row,
            column: tile1.column,
          },
          p2: {
            row: tile2.row,
            column: tile2.column,
          },
        };
        wsRef.current.send(JSON.stringify(message));
      } else {
        console.error("WebSocket is not connected");
        setError(ErrorMessage.ConnectionError);
      }
    }
  }, [tile1, tile2]);

  const handleClick = (position: Coordinate) => {
    return tile1 ? setTile2(position) : setTile1(position);
  };

  // render all game states except "Inprogress"
  const renderGameState = () => {
    if (!showInfo && gameState) {
      if (gameState.type === "AwaitingPlayers") {
        return <Awaiting state={gameState} />;
      } else if (gameState.type === "GameStartsSoon") {
        return <StartSoon state={gameState} />;
      } else if (gameState.type === "Win") {
        return <Win state={gameState} />;
      } else if (gameState.type === "Lose") {
        return <Lose state={gameState} />;
      }
    } else if (gameState) {
      return <GameStateInfo state={gameState} />;
    }
  };
  return (
    <div className="game-container">
      <Header hasBackButton={true} />
      <div className="game-content">
        {board && gameState && gameState.type !== "Win" ? (
          <div className={`board-wrapper-${level}`}>
            <div className={`board ${level}-grid`}>
              {board.map((row, rowIndex) =>
                row.map((tile, colIndex) => (
                  <Tile
                    key={`${rowIndex}-${colIndex}`}
                    value={tile}
                    position={{ row: rowIndex, column: colIndex }}
                    isSelected={
                      (tile1 &&
                        tile1.row === rowIndex &&
                        tile1.column === colIndex) ||
                      (tile2 &&
                        tile2.row === rowIndex &&
                        tile2.column === colIndex) ||
                      false
                    }
                    onClick={handleClick}
                  />
                ))
              )}
            </div>
            <Path points={path} />
          </div>
        ) : error ? (
          <div className="error-message-container">
            <p className="error-message">{error}</p>
          </div>
        ) : (
          <div className="game-message-container">{renderGameState()}</div>
        )}
      </div>
    </div>
  );
}

export default Game;
