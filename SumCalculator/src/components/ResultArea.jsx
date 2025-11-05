import React from 'react';

const ErrorMessage = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="error-message">
      <strong>Error:</strong> {error}
    </div>
  );
};

const SumResult = ({ sum }) => {
  if (sum === null) return null;
  
  return (
    <div className="sum-result">
      <strong>Sum Result:</strong> {sum}
    </div>
  );
};

const ResultArea = ({ error, sum }) => {
  return (
    <div className="result-area">
      <ErrorMessage error={error} />
      <SumResult sum={sum} />
    </div>
  );
};

export default ResultArea;