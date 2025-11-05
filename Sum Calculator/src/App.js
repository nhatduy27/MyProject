import React, { useState } from 'react';
import './App.css';

function App() {
   
  //Khai báo và quản lí các biến number1 và number2
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [sum, setSum] = useState(null);
  const [error, setError] = useState(''); // Biến hiện các lỗi phát sinh

  //Hàm xử lí tính toán
  const calculateSum = () => {
    
    //Khởi tạo giá trị
    setError('');
    setSum(null);

    //Kiểm tra xem đã nhập số chưa
    if (!number1.trim() || !number2.trim()) {
      setError('Please enter both numbers');
      return;
    }

    //Chuyển chuỗi thành số 
    const num1 = parseFloat(number1);
    const num2 = parseFloat(number2);

    //Kiểm tra tính hợp lệ
    if (isNaN(num1) || isNaN(num2)) {
      setError('Please enter valid numbers');
      return;
    }

    //gán giá trị cho sum
    setSum(num1 + num2);
  
  };

  // gọi các hàm onChage khác tương ứng (hàm bậc cao)
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  //Hàm reset lại máy tính
  const resetFields = () => {
    setNumber1('');
    setNumber2('');
    setSum(null);
    setError('');
  };

  return (
    <div className="App">
      <div className="calculator-container">
        <h1>Sum Calculator</h1>
        
        {}
        <div className="input-group">
          <label htmlFor="number1">First Number:</label>
          <input
            id="number1"
            type="text"
            value={number1}
            onChange={handleInputChange(setNumber1)}
            placeholder="Enter first number"
            className="number-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="number2">Second Number:</label>
          <input
            id="number2"
            type="text"
            value={number2}
            onChange={handleInputChange(setNumber2)}
            placeholder="Enter second number"
            className="number-input"
          />
        </div>

        
        <div className="button-group">
          <button 
            onClick={calculateSum} 
            className="calculate-btn"
          >
            Calculate Sum
          </button>
          <button 
            onClick={resetFields} 
            className="reset-btn"
          >
            Reset
          </button>
        </div>

        
        <div className="result-area">
          
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          
          {sum !== null && (
            <div className="sum-result">
              <strong>Sum Result:</strong> {sum}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;