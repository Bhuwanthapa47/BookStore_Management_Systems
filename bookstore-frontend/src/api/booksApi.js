import axiosInstance from './axiosInstance';

export const getBooks = (params) => axiosInstance.get('/api/books', { params });
export const getBookById = (id) => axiosInstance.get(`/api/books/${id}`);
export const createBook = (data) => axiosInstance.post('/api/books', data);
export const updateBook = (id, data) => axiosInstance.put(`/api/books/${id}`, data);
export const deleteBook = (id) => axiosInstance.delete(`/api/books/${id}`);
