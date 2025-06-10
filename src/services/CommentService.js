import axios from 'axios';
import { axiosJWT } from "./UserService";


export const createComment = async (data, access_token) => {
  return axiosJWT.post(`${process.env.REACT_APP_API_URL}/comment/create`, data, {
    headers: { 
        token: `Bearer ${access_token}`
    }
  });
};

export const getCommentsByProduct = async (id) => {
    console.log("🔍 Gọi API: ", `${process.env.REACT_APP_API_URL}/comment/product/${id}`);
    return axios.get(`${process.env.REACT_APP_API_URL}/comment/product/${id}`);
};

export const getAllComments = async (access_token) => {
  return axiosJWT.get(`${process.env.REACT_APP_API_URL}/comment/all`, {
    headers: { 
        token: `Bearer ${access_token}` 
    }
  });
};

export const deleteComment = async (id, access_token) => {
  return axiosJWT.delete(`${process.env.REACT_APP_API_URL}/comment/${id}`, {
    headers: { 
        token: `Bearer ${access_token}` 
    }
  });
};
