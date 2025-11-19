// Import hooks từ React
import { useEffect, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Component xử lý infinite scroll
const InfiniteScroll = ({ loading, hasMore, onLoadMore, children }) => {
  // Refs để lưu trữ DOM elements
  const observerRef = useRef();
  const lastElementRef = useRef();

  // useEffect để setup Intersection Observer
  useEffect(() => {
    // Nếu đang loading thì không làm gì
    if (loading) return;

    // Tạo Intersection Observer
    observerRef.current = new IntersectionObserver(entries => {
      // Khi element được quan sát xuất hiện trong viewport
      if (entries[0].isIntersecting && hasMore) {
        // Gọi hàm load more
        onLoadMore();
      }
    });

    // Bắt đầu quan sát element cuối cùng
    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    // Cleanup function - chạy khi component unmount
    return () => {
      if (observerRef.current) {
        // Dừng quan sát
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, onLoadMore]); // Chạy lại khi các dependencies thay đổi

  return (
    <div>
      {/* Hiển thị children (các photos) */}
      {children}
      
      {/* Element vô hình để quan sát khi scroll tới */}
      <div ref={lastElementRef} style={{ height: '1px' }} />
      
      {/* Hiển thị loading khi đang tải */}
      {loading && <LoadingSpinner />}
      
      {/* Hiển thị thông báo hết ảnh */}
      {!hasMore && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          🎉 Đã xem hết ảnh!
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;