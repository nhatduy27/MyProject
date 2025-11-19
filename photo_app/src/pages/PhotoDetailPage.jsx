import React, { useState, useEffect } from 'react';
// Import hooks từ react-router-dom
import { useParams, useNavigate } from 'react-router-dom';
// Import API function
import { getPhotoDetail } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const PhotoDetailPage = () => {
  // Lấy ID từ URL parameters
  const { id } = useParams();
  // Hook để chuyển trang
  const navigate = useNavigate();
  // State lưu thông tin photo
  const [photo, setPhoto] = useState(null);
  // State loading
  const [loading, setLoading] = useState(true);
  // State lỗi
  const [error, setError] = useState(null);

  // useEffect chạy khi component mount hoặc ID thay đổi
  useEffect(() => {
    // Hàm async fetch photo detail
    const fetchPhotoDetail = async () => {
      try {
        setLoading(true);
        // Gọi API lấy chi tiết photo
        const photoData = await getPhotoDetail(id);
        // Cập nhật state với data nhận được
        setPhoto(photoData);
      } catch (err) {
        // Xử lý lỗi
        setError('Không thể tải thông tin ảnh');
        console.error(err);
      } finally {
        // Luôn tắt loading dù thành công hay thất bại
        setLoading(false);
      }
    };

    fetchPhotoDetail();
  }, [id]); // Chạy lại khi id thay đổi

  // Hiển thị loading nếu đang tải
  if (loading) return <LoadingSpinner />;
  
  // Hiển thị lỗi nếu có
  if (error) return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
      {/* Nút quay lại */}
      <button onClick={() => navigate('/')}>← Quay lại</button>
    </div>
  );

  // Hiển thị chi tiết photo
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Nút quay lại */}
      <button 
        onClick={() => navigate('/')}
        style={{
          padding: '10px 15px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        ← Quay lại Gallery
      </button>

      {/* Nếu có photo thì hiển thị */}
      {photo && (
        <div style={{ textAlign: 'center' }}>
          {/* Ảnh full size */}
          <img 
            src={photo.download_url} 
            alt={photo.author}
            style={{
              maxWidth: '100%',        // Responsive - không vượt quá container
              maxHeight: '70vh',       // Tối đa 70% chiều cao màn hình
              borderRadius: '8px',     // Bo góc
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)' // Đổ bóng
            }}
          />
          
          {/* Thông tin photo */}
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <h2>Thông tin ảnh</h2>
            <p><strong>ID:</strong> {photo.id}</p>
            <p><strong>Tác giả:</strong> {photo.author}</p>
            <p><strong>Chiều rộng:</strong> {photo.width}px</p>
            <p><strong>Chiều cao:</strong> {photo.height}px</p>
            <p><strong>URL:</strong> 
              <a href={photo.url} target="_blank" rel="noopener noreferrer" style={{marginLeft: '10px'}}>
                Xem gốc
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoDetailPage;