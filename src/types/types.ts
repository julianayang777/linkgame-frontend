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

export type Coordinate = {
  x: number;
  y: number;
};

export type Board = number[][];

export interface RoomState {
  id: string;
  name: string;
  level: GameLevel;
  joinedPlayers: number;
  requiredPlayers: number;
  status: "Awaiting Players" | "Starts Soon" | "In Progress" | "Finished", 
  wasInRoom: boolean;
}