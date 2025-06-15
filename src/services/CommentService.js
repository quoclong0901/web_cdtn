import axios from 'axios';
import { axiosJWT } from "./UserService";


export const createComment = async (data, access_token) => {
  return axiosJWT.post(`${process.env.REACT_APP_API_URL}/comment/create`, data, {
    headers: { 
        token: `Bearer ${access_token}`
    }
  });
};

export const updateComment =  async (commentId, data, access_token) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/comment/${commentId}`,data,{
    headers: { 
      token: `Bearer ${access_token}`
    }
  });
};

export const getCommentsByProduct = async (id, page = 1, limit = 5) => {
    return axios.get(`${process.env.REACT_APP_API_URL}/comment/product/${id}?page=${page}&limit=${limit}`);
};

export const deleteComment = async (id, access_token) => {
  return axiosJWT.delete(`${process.env.REACT_APP_API_URL}/comment/${id}`, {
    headers: { 
        token: `Bearer ${access_token}` 
    }
  });
};

// Admin 
export const getAllComments = async (page = 1, limit = 8, access_token) => {
  try {
   
    return axiosJWT.get(`${process.env.REACT_APP_API_URL}/comment/all?page=${page}&limit=${limit}`, {
      headers: {
        token: `Bearer ${access_token}`
      }
    });
  } catch (error) {
    throw error;
  }
};

export const adminDeleteComment = async (id, access_token) => {
  return axiosJWT.delete(`${process.env.REACT_APP_API_URL}/comment/admin/${id}`, {
    headers: { 
        token: `Bearer ${access_token}` 
    }
  });
};
