import React from 'react';
// Import custom hook
import usePhotos from '../hooks/usePhotos';
// Import components
import PhotoCard from '../components/PhotoCard';
import InfiniteScroll from '../components/InfiniteScroll';
import LoadingSpinner from '../components/LoadingSpinner';

const PhotoListPage = () => {
  // Sử dụng custom hook để lấy state và functions
  const { photos, loading, hasMore, fetchPhotos } = usePhotos();

  return (
    // Container với padding
    <div style={{ padding: '20px' }}>
      {/* Tiêu đề trang */}
      <h1 style={{ textAlign: 'center' }}>📸 Photo Gallery</h1>
      
      {/* InfiniteScroll component bao bọc danh sách ảnh */}
      <InfiniteScroll
        loading={loading}        // Truyền prop loading
        hasMore={hasMore}       // Truyền prop hasMore
        onLoadMore={fetchPhotos} // Truyền hàm load more
      >
        {/* Grid layout cho danh sách ảnh */}
        <div style={{
          display: 'grid', // Sử dụng CSS Grid
          // Tự động tạo columns, mỗi column ít nhất 250px
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '15px',     // Khoảng cách giữa các items
          padding: '20px 0'
        }}>
          {/* Map qua mảng photos và render PhotoCard cho mỗi photo */}
          {photos.map(photo => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      </InfiniteScroll>

      {/* Loading ban đầu - khi chưa có photos nào */}
      {photos.length === 0 && loading && <LoadingSpinner />}
    </div>
  );
};

export default PhotoListPage;