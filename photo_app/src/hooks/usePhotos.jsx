// Import các hooks từ React
import { useState, useEffect, useCallback } from 'react';
// Import hàm gọi API
import { getPhotos } from '../services/api';

// Custom hook quản lý state và logic của photos
const usePhotos = () => {
  // State lưu danh sách ảnh
  const [photos, setPhotos] = useState([]);
  // State lưu trang hiện tại (phân trang)
  const [page, setPage] = useState(1);
  // State xác định có đang loading không
  const [loading, setLoading] = useState(false);
  // State xác định còn ảnh để load không
  const [hasMore, setHasMore] = useState(true);

  // Hàm fetch photos - dùng useCallback để tránh tạo hàm mới mỗi lần render
  const fetchPhotos = useCallback(async () => {
    // Nếu đang loading thì không fetch tiếp
    if (loading) return;
    
    // Bắt đầu loading
    setLoading(true);
    try {
      // Gọi API lấy photos với page hiện tại
      const newPhotos = await getPhotos(page);
      
      // Nếu không có photos mới -> hết ảnh
      if (newPhotos.length === 0) {
        setHasMore(false);
      } else {
        // Thêm photos mới vào cuối danh sách cũ
        setPhotos(prev => [...prev, ...newPhotos]);
        // Tăng page lên 1 để lần sau load trang tiếp theo
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error in fetchPhotos:', error);
    } finally {
      // Dù thành công hay thất bại cũng tắt loading
      setLoading(false);
    }
  }, [page, loading]); // Dependency array - chỉ tạo hàm mới khi page hoặc loading thay đổi

  // useEffect chạy khi component mount lần đầu
  useEffect(() => {
    fetchPhotos();
  }, []); // Empty dependency array - chỉ chạy 1 lần

  // Trả về các values và functions để component sử dụng
  return { photos, loading, hasMore, fetchPhotos };
};

export default usePhotos;