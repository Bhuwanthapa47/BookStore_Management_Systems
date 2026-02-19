import axiosInstance from './axiosInstance';

export const placeOrder = (data) => axiosInstance.post('/api/orders', data);
export const getMyOrders = (params) => axiosInstance.get('/api/orders/my-orders', { params });
export const getAllOrders = (params) => axiosInstance.get('/api/orders', { params });
export const getOrderById = (id) => axiosInstance.get(`/api/orders/${id}`);
export const updateOrderStatus = (id, data) => axiosInstance.put(`/api/orders/${id}/status`, data);
