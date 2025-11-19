import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import React Router để quản lý routing
import PhotoListPage from './pages/PhotoListPage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import './App.css';


function App() {

  return (

    <Router>
      <div className='App'>
        <Routes>
          {/* Route cho trang chủ - hiển thị danh sách ảnh */}
          <Route path="/" element={<PhotoListPage />} />
          {/* Route cho trang chi tiết ảnh 
              :id là parameter - sẽ thay bằng ID thực tế như 1, 2, 3... */}
          <Route path="/photos/:id" element={<PhotoDetailPage />} />
        </Routes>
      </div>

    </Router>

  )
};

export default App;