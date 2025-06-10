import React, { useEffect, useState } from 'react';
import { createComment, getCommentsByProduct } from '../../services/CommentService';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, List, Typography, message } from 'antd';

const { TextArea } = Input;

const CommentSection = ({ idProduct }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const [form] = Form.useForm();

  const fetchComments = async () => {
    try {
      const res = await getCommentsByProduct(idProduct);
      setComments(res.data);
    } catch (err) {
      console.error('Lỗi khi fetch bình luận:', err);
      message.error('Không thể tải bình luận');
    }
  };

  const handleSubmit = async (values) => {
    if (!user?.access_token) {
      navigate('/sign-in', { state: location?.pathname });
      return;
    }

    const { content } = values;
    if (!content.trim()) return;

    try {
      setLoading(true);
      await createComment({ content, idProduct }, user.access_token);
      form.resetFields();
      await fetchComments();
      message.success('Gửi bình luận thành công');
    } catch (err) {
      console.error('Lỗi khi gửi bình luận:', err);
      message.error('Gửi bình luận thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("📦 idProduct:", idProduct);
    if (idProduct) {
      fetchComments();
    }
  }, [idProduct]);
  

  return (
    <div style={{ marginTop: '32px', padding: '24px', background: '#fff', borderRadius: '8px' }}>
      <Typography.Title level={4}>Bình luận sản phẩm</Typography.Title>

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="content"
          rules={[
            { required: true, message: 'Vui lòng nhập nội dung bình luận' },
            { min: 3, message: 'Bình luận quá ngắn' }
          ]}
        >
          <TextArea rows={4} placeholder="Nhập bình luận của bạn..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Gửi bình luận
          </Button>
        </Form.Item>
      </Form>

      <List
        header={<b>{comments.length} bình luận</b>}
        dataSource={comments}
        locale={{ emptyText: 'Chưa có bình luận nào.' }}
        renderItem={(item) => (
          <List.Item style={{ borderBottom: '1px solid #f0f0f0' }}>
            <List.Item.Meta
              title={<b>{item.user?.name || 'Người dùng'}</b>}
              description={item.content}
            />
          </List.Item>
        )}
        style={{ marginTop: '24px' }}
      />
    </div>
  );
};

export default CommentSection;
