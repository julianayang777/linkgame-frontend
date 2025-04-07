import { RoomState } from "../../types/types";
import ItemActions from "./ItemActions";
import "./RoomListItem.css";

interface RoomListItemProps {
  room: RoomState;
  onClick: (room: RoomState) => void;
}

function RoomListItem({ room, onClick }: RoomListItemProps) {
  const handleJoin = () => {
    onClick(room);
  };

  return (
    <tr>
      <td className="room-item-id">{room.name}</td>
      <td className="room-item-level">{room.level}</td>
      <td className="room-item-players">{`${room.joinedPlayers}/${room.requiredPlayers}`}</td>
      <td className="room-item-status">{room.status}</td>
      <td className="room-item-actions">
        <ItemActions
          onClick={handleJoin}
          isDisabled={room.joinedPlayers === room.requiredPlayers}
        />
      </td>
    </tr>
  );
}

export default RoomListItem;
