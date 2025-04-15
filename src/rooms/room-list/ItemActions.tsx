import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import "./ItemActions.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ItemActionsProps {
  onClick: () => void;
  isDisabled: boolean;
}

function ItemActions({ onClick, isDisabled }: ItemActionsProps) {
  return (
    <div className="item-actions">
      <button className="join-button" onClick={onClick} disabled={isDisabled}>
        Join
      </button>
    </div>
  );
}

export default ItemActions;
