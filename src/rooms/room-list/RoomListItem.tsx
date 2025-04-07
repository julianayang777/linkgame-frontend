import { RoomState } from "../../types/types";
import ItemActions from "./ItemActions";

interface RoomListItemProps {
  room: RoomState;
}

function RoomListItem({ room }: RoomListItemProps) {
  return (
    <tr>
      <td className="room-item-id">{room.name}</td>
      <td className="room-item-level">{room.level}</td>
      <td className="room-item-players">{`${room.joinedPlayers}/${room.requiredPlayers} Players`}</td>
      <td className="room-item-status">{room.status}</td>
      <td className="room-item-actions">
        <ItemActions />
      </td>
    </tr>
  );
}

export default RoomListItem;
