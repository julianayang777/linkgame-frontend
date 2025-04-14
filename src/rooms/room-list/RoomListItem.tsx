import { RoomState } from "../../types/types";
import ItemActions from "./ItemActions";
import "./RoomListItem.css";

interface RoomListItemProps {
  room: RoomState;
  filterAvailable: boolean;
  onClick: (room: RoomState) => void;
}

function RoomListItem({ room, onClick, filterAvailable }: RoomListItemProps) {
  const canJoin =
    (room.status !== "Finished" || room.joinedPlayers < room.requiredPlayers) &&
    room.canJoin;

  const handleJoin = () => {
    onClick(room);
  };

  if (filterAvailable && !canJoin) return null;

  return (
    <tr>
      <td className="room-item-id">{room.name}</td>
      <td className="room-item-level">{room.level}</td>
      <td className="room-item-players">{`${room.joinedPlayers}/${room.requiredPlayers}`}</td>
      <td className="room-item-status">{room.status}</td>
      <td className="room-item-actions">
        <ItemActions
          onClick={handleJoin}
          isDisabled={
            (room.status === "Finished" &&
              room.joinedPlayers === room.requiredPlayers) ||
            !room.canJoin
          }
        />
      </td>
    </tr>
  );
}

export default RoomListItem;
