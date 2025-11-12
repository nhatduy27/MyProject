import React, { useState } from 'react';
import InputField from './InputField';
import ButtonGroup from './ButtonGroup';
import ResultArea from './ResultArea';

const SumCalculator = () => {
    
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [sum, setSum] = useState(null);
  const [error, setError] = useState('');

  // Hàm xử lý thay đổi input
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  // Hàm tính tổng
  const calculateSum = () => {
    setError('');
    setSum(null);

    if (!number1.trim() || !number2.trim()) {
      setError('Please enter both numbers');
      return;
    }

    const num1 = parseFloat(number1);
    const num2 = parseFloat(number2);

    if (isNaN(num1) || isNaN(num2)) {
      setError('Please enter valid numbers');
      return;
    }

    setSum(num1 + num2);
  };

  // Hàm reset
  const resetFields = () => {
    setNumber1('');
    setNumber2('');
    setSum(null);
    setError('');
  };

  return (
    <div className="calculator-container">
      <h1>Sum Calculator</h1>
      
      <InputField
        label="First Number:"
        id="number1"
        value={number1}
        onChange={handleInputChange(setNumber1)}
        placeholder="Enter first number"
      />
      
      <InputField
        label="Second Number:"
        id="number2"
        value={number2}
        onChange={handleInputChange(setNumber2)}
        placeholder="Enter second number"
      />

      <ButtonGroup
        onCalculate={calculateSum}
        onReset={resetFields}
      />

      <ResultArea
        error={error}
        sum={sum}
      />
    </div>
  );
};

export default SumCalculator;