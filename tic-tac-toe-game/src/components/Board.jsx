import React from 'react';
import Square from './Square';
import {calculateWinner} from './GameUntils';

function Board({ xIsNext, squares, onPlay, winningLine }) {

  //xử lí khi click vào ô
  function handleClick(i) {
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  //Sinh ra bảng 3x3 bằng vòng lặp
  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        const index = i * 3 + j;
        row.push(

          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            isWinning={winningLine && winningLine.includes(index)}
          />
        );
      }

      board.push(
        <div key={i} className="board-row" style={{ display: 'contents' }}>
          {row}
        </div>
      );
    }
    return board;
  };

  return (
    <div className="board">
      {renderBoard()}
    </div>
  );
}

export default Board;