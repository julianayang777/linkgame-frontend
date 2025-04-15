import { GameLevel } from "../types/types";

export function removeQuotes(str: string): string {
  return str.replace(/^"|"$/g, "");
}

export function millisecondsToTime(ms: number | null): string {
  if (ms) {
    if (ms < 0) {
      throw new Error("Time cannot be negative");
    }

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 60 / 60) % 24);

    const paddedSeconds = seconds.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");

    if (hours > 0) {
      const paddedHours = hours.toString().padStart(2, "0");
      return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    } else {
      return `${paddedMinutes}:${paddedSeconds}`;
    }
  } else {
    return "--:--";
  }
}

export function toGameLevel(level: string | undefined): GameLevel | undefined {
  switch (level) {
    case "easy":
      return GameLevel.EASY;
    case "medium":
      return GameLevel.MEDIUM;
    case "hard":
      return GameLevel.HARD;
  }
}
