import React, { useState } from 'react';
import Board from './Board';
import GameInfo from './GameInfo';
import { calculateWinner } from './GameUntils';

export default function Game() {

  const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveLocation: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const winnerInfo = calculateWinner(currentSquares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : null;


  function handlePlay(nextSquares, moveIndex) {
    const row = Math.floor(moveIndex / 3) + 1;
    const col = (moveIndex % 3) + 1;
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { 
        squares: nextSquares, 
        moveLocation: `(${row}, ${col})`
      }
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }


  function jumpTo(nextMove) {

    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {

    setIsAscending(!isAscending);
  }

  function restartGame() {
    setHistory([{ squares: Array(9).fill(null), moveLocation: null }]);
    setCurrentMove(0);
    setIsAscending(true);
  }
  

  let status;
  if (winner) {
    status = `Người thắng: ${winner}`;
  } else if (currentSquares.every(square => square !== null)) {
    status = 'Kết quả: Hòa!';
  } else {
    status = `Lượt kế tiếp: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="container">
      <h1>Tic-Tac-Toe Game</h1>
      
      <div className="game">
        <div className="game-board">
          <div className={`status ${winner ? 'winner' : ''} ${status.includes('Hòa') ? 'draw' : ''}`}>
            {status}
          </div>
          <div className="board-container">
            <Board 
              xIsNext={xIsNext} 
              squares={currentSquares} 
              onPlay={handlePlay}
              winningLine={winningLine}
            />
          </div>
        </div>
        
        <GameInfo
          history={history}
          currentMove={currentMove}
          isAscending={isAscending}
          onJumpTo={jumpTo}
          onToggleSort={toggleSortOrder}
          onRestart={restartGame}
        />
      </div>
    </div>
  );
}