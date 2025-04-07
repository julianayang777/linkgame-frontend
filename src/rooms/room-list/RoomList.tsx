import { RoomState } from "../../types/types";
import "./RoomList.css";
import RoomListItem from "./RoomListItem";

interface RoomListProps {
  data: RoomState[];
}

function RoomList({ data }: RoomListProps) {
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
        {data.map((room: RoomState) => (
          <RoomListItem key={room.id} room={room}/>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default RoomList;
