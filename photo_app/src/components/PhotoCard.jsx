import React from "react";
import { useNavigate } from 'react-router-dom';

const PhotoCard = ({photo}) => {

    const navigate = useNavigate();
    const handleClick = () => {

        navigate(`/photos/${photo.id}`)
    }


    return (
    // Div bao ngoài mỗi thẻ ảnh
    <div 
      style={{
        border: '1px solid #ddd',      // Viền xám nhạt
        borderRadius: '8px',           // Bo góc
        padding: '10px',               // Khoảng cách bên trong
        margin: '10px',                // Khoảng cách bên ngoài
        cursor: 'pointer',             // Con trỏ thành bàn tay khi hover
        textAlign: 'center'            // Căn giữa nội dung
      }}
      // Gán sự kiện click
      onClick={handleClick}
    >
      {/* Hiển thị ảnh thumbnail */}
      <img 
        // URL ảnh với kích thước cố định 300x200
        src={`https://picsum.photos/id/${photo.id}/300/200`} 
        // Alt text cho accessibility
        alt={photo.author}
        style={{
          width: '100%',              // Chiều rộng 100% của container
          height: '150px',            // Chiều cao cố định
          objectFit: 'cover',         // Ảnh phủ kín khung không bị méo
          borderRadius: '4px'         // Bo góc ảnh
        }}
      />
      {/* Tên tác giả */}
      <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
        {photo.author}
      </p>
    </div>
  );
    
};

export default PhotoCard


