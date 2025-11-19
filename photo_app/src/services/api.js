
import axios from 'axios';
const BASE_URL = 'https://picsum.photos/v2' //đường dẫn URL cơ bản

export const getPhotos = async (page = 1) => {

    try {
    // Gọi API để lấy danh sách ảnh với page và limit
    const response = await axios.get(`${BASE_URL}/list?page=${page}&limit=10`);
    return response.data;
  } catch (error) {
    // Bắt lỗi nếu có và in ra console
    console.error('Error fetching photos:', error);
    throw error;
  }
};



export const getPhotoDetail = async (id) => {

    try{
        
        const response = await axios.get(`https://picsum.photos/id/${id}/info`);
        return response.data

    }
    catch(error){

        console.log('Error fetching photo detail:', error)
        throw error
    }
};
