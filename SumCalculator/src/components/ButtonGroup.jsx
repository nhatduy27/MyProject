import React from 'react';

const ButtonGroup = ({ onCalculate, onReset }) => {
  return (
    <div className="button-group">
      <button onClick={onCalculate} className="calculate-btn">
        Calculate Sum
      </button>
      <button onClick={onReset} className="reset-btn">
        Reset
      </button>
    </div>
  );
};

export default ButtonGroup;