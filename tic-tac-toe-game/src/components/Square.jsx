import React from 'react';

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button 
      className={`square ${value?.toLowerCase()} ${isWinning ? 'winning' : ''}`} 
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export default Square;