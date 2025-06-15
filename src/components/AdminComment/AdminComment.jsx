import React, { useEffect, useState, useCallback } from 'react';
import { adminDeleteComment, getAllComments } from '../../services/CommentService';
import { useSelector } from 'react-redux';
import { Table, Button, Space, Popconfirm, Rate, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const AdminComment = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0
  });
  const user = useSelector((state) => state.user);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchAll = useCallback(async (page = 1, pageSize = 6) => {
    try {
      setLoading(true);
      const res = await getAllComments(page, pageSize, user.access_token);

      if (res?.data?.comments) {
        setComments(res.data.comments);
        setPagination({
          current: res.data.currentPage || 1,
          pageSize: pageSize,
          total: res.data.totalComments || 0
        });
      } else {
        setComments([]);
        messageApi.error('Định dạng dữ liệu không hợp lệ nhận được từ máy chủ');
      }
    } catch (error) {
      messageApi.error('Lỗi!');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [user.access_token, messageApi]);

  const handleDelete = async (id) => {
    if (!id) {
      messageApi.error('ID comment không hợp lệ ');
      return;
    }
    try {
      await adminDeleteComment(id, user.access_token);
      messageApi.success('Xóa comment thành công ');
      fetchAll(pagination.current, pagination.pageSize);
    } catch (error) {
      messageApi.error('Lỗi xóa comment!');
    }
  };

  const handleTableChange = (pagination) => {
    fetchAll(pagination.current, pagination.pageSize);
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: ['product', 'name'],
      key: 'product',
      width: '25%',
    },
    {
      title: 'Người dùng',
      dataIndex: ['user', 'email'],
      key: 'user',
      width: '15%',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: '10%',
      render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: (a, b) => a.rating - b.rating,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Bình luận',
      dataIndex: 'commentText',
      key: 'commentText',
      width: '25%',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Trạng thái',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn muốn xóa comment?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />}
            >
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {contextHolder}
      <h2 style={{marginBottom: '24px', paddingTop: '10px'}}>Quản lý Bình luận</h2>
      <Table
        columns={columns}
        dataSource={comments}
        rowKey="_id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default AdminComment;
