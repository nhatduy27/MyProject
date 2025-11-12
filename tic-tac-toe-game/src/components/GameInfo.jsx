import React from 'react';
import MovesList from './MovesList';
import Controls from './Controls';

function GameInfo({ 
  history, 
  currentMove, 
  isAscending, 
  onJumpTo, 
  onToggleSort, 
  onRestart,
}) {
  return (
    <div className="game-info">
      <div className="current-move">
        {currentMove === history.length - 1 
          ? `Bạn đang ở nước đi #${currentMove}`
          : `Đang xem nước đi #${currentMove}`
        }
      </div>
      
      <Controls 
        onToggleSort={onToggleSort}
        onRestart={onRestart}
        isAscending={isAscending}
      />
      
      <MovesList 
        history={history}
        currentMove={currentMove}
        isAscending={isAscending}
        onJumpTo={onJumpTo}
      />
      
    </div>
  );
}

export default GameInfo;