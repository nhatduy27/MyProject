import React from 'react';

function Controls({ onToggleSort, onRestart, isAscending }) {
  return (
    <div className="controls">
      <button className="toggle-btn" onClick={onToggleSort}>
        {isAscending ? 'Sắp xếp Giảm dần' : 'Sắp xếp Tăng dần'}
      </button>
      <button onClick={onRestart}>Chơi lại</button>
    </div>
  );
}

export default Controls;