export const boardAssets: { [key: number]: string } = {
  1: "\uD83D\uDD35", // 🔵
  2: "\uD83D\uDFE1", // 🟡
  3: "\uD83D\uDD34", // 🔴
  4: "\uD83D\uDFE2", // 🟢
  5: "\uD83D\uDFE3", // 🟣
  6: "\uD83D\uDC3C", // 🐼
  7: "\uD83D\uDC28", // 🐨
  8: "\uD83D\uDC23", // 🐣
  9: "\uD83E\uDD86", // 🦆
  10: "\uD83D\uDC38", // 🐸
  11: "\uD83E\uDD93", // 🦓
  12: "\uD83E\uDD88", // 🦈
};

export enum GameLevel {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum ErrorMessage {
  ServerError = "[Server Error] Unable to connect to the server. Please try again later.",
  UserNotAuthenticated = "User not authenticated.",
  UserNotFound = "User not found.",
  InvalidUsername = "Username must be 3-20 characters long and can only contain letters, numbers, and underscores.",
  InvalidNumberOfPlayers = "Number of players must be an integer greater than 0.",
  UnexpectedError = "An unexpected error occurred. Please try again later.",
  FailedRetrievePlayer = "Failed to retrieve player.",
  ConnectionError = "Connection error. Please check your network connection.",
  RoomNotFound = "Room not found.",
  PlayerNotFound = "Player not found. Please signup.",
}

export enum ServerResponseError {
  UserAlreadyExists = "server.auth.UserAlreadyExists$",
  UserNotFound = "server.auth.UserNotFound$",
  PlayerNotFound = "server.player.PlayerNotFound$",
  NumberPlayersNotInteger = "Invalid number of players: could not parse the input as an integer.",
  NumberPlayersNotGreaterThanZero = "Invalid number of players: must be greater than 0.",
  FailedRetrievePlayer = "Failed to retrieve player.",
  RoomNotFound = "Room {roomId} not found.",
  InvalidMatch = "InvalidMatch",
}

export type Coordinate = {
  row: number;
  column: number;
};

export type Board = number[][];

export interface RoomState {
  id: string;
  name: string;
  level: GameLevel;
  joinedPlayers: number;
  requiredPlayers: number;
  status: "Awaiting Players" | "Starts Soon" | "In Progress" | "Finished";
  canJoin: boolean;
}

export interface Player {
  name: string;
}

export type GameState =
  | AwaitingPlayers
  | GameStartsSoon
  | InProgress
  | Finished;

export interface AwaitingPlayers {
  type: "AwaitingPlayers";
  id: string;
  level: GameLevel;
  joinedPlayers: number;
  requiredPlayers: number;
}

export interface GameStartsSoon {
  type: "GameStartsSoon";
  id: string;
  level: GameLevel;
  joinedPlayers: Player[];
  startIn: number; // in milliseconds
}

export interface InProgress {
  type: "InProgress";
  id: string;
  level: GameLevel;
  playerBoards: { [key: string]: Board };
}

export interface Finished {
  type: "Win" | "Lose" | "Finished";
  id: string;
  level: GameLevel;
  winner: Player;
  timeTaken: number;
}
