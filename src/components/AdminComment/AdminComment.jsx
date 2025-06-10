import React, { useEffect, useState } from 'react';
import { deleteComment, getAllComments } from '../../services/CommentService';
import { useSelector } from 'react-redux';

const AdminComment = () => {
  const [comments, setComments] = useState([]);
  const user = useSelector((state) => state.user);

  const fetchAll = async () => {
    const res = await getAllComments(user.access_token);
    setComments(res.data);
  };

  const handleDelete = async (id) => {
    await deleteComment(id, user.access_token);
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div>
      <h2>Quản lý bình luận</h2>
      <table>
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Sản phẩm</th>
            <th>Nội dung</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((cmt) => (
            <tr key={cmt._id}>
              <td>{cmt.user.name}</td>
              <td>{cmt.product.name}</td>
              <td>{cmt.content}</td>
              <td><button onClick={() => handleDelete(cmt._id)}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminComment;
