import React from 'react';

function MovesList({ history, currentMove, isAscending, onJumpTo }) {
  
  const moves = history.map((step, move) => {
    if (move === 0) return null;
    
    const description = `Nước đi #${move} ${step.moveLocation}`;
    return { move, description };
  }).filter(item => item !== null);

  if (!isAscending) {
    moves.reverse();
  }

  return (
    <div className="moves-list-container">
      <div className="moves-list">
        {moves.map(({ move, description }) => (
          <div 
            key={move}
            className={`move-item ${move === currentMove ? 'current' : ''}`}
            onClick={() => onJumpTo(move)}
          >
            <span className="move-number">{description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovesList;