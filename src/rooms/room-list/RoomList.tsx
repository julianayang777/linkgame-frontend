import { RoomState } from "../../types/types";
import "./RoomList.css";
import RoomListItem from "./RoomListItem";

interface RoomListProps {
  data: RoomState[];
  filterAvailable: boolean;
  onClick: (room: RoomState) => void;
}

function RoomList({ data, filterAvailable, onClick }: RoomListProps) {
  const filteredData = filterAvailable
    ? data.filter(
        (room) =>
          (room.status !== "Finished" ||
            room.joinedPlayers < room.requiredPlayers) &&
          room.canJoin
      )
    : data;

  const message =
    data.length === 0
      ? "No rooms have been created yet."
      : filteredData.length === 0
      ? "No rooms available."
      : "";

  return (
    <div className="room-list">
      <table id="rooms">
        <thead>
          <tr>
            <th>Room</th>
            <th>Difficulty</th>
            <th>Players</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {message ? (
            <tr>
              <td colSpan={5}>{message}</td>
            </tr>
          ) : (
            data.map((room: RoomState) => (
              <RoomListItem
                key={room.id}
                room={room}
                onClick={onClick}
                filterAvailable={filterAvailable}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RoomList;
