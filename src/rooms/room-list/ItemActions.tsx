import "./ItemActions.css";

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
