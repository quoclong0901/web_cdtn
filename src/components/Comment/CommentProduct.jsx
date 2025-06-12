import React, { useState, useEffect } from 'react';
import { getCommentsByProduct, createComment, deleteComment, updateComment } from '../../services/CommentService';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { 
  Card, 
  Button, 
  Rate, 
  message, 
  List, 
  Avatar, 
  Space, 
  Popconfirm,
  Divider,
  DatePicker,
  Pagination,
  Flex
} from 'antd';
import { 
  UserOutlined, 
  DeleteOutlined, 
  StarFilled,
  EditOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import CommentModal from './CommentModal';

const CommentContainer = styled.div`
  margin: 0 auto;
  width: 80%;
`;

const CommentList = styled(List)`
  .ant-list-item {
    padding: 16px 0;
  }
`;

const ActionButton = styled(Button)`
  
`;

export default function CommentProduct() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const user = useSelector((state) => state.user);
  const [messageApi, contextHolder] = message.useMessage();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await getCommentsByProduct(id, currentPage, pageSize);
      setComments(res.data.comments);
      setTotalItems(res.data.totalComments);
    } catch (error) {
      messageApi.error('Không thể tải bình luận');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id, currentPage, pageSize]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleSubmit = async (values) => {
    if (!user?.access_token) {
      messageApi.error('Vui lòng đăng nhập để bình luận');
      return;
    }

    try {
      if (editingComment) {
        await updateComment(editingComment._id, {
          commentText: values.comment,
          rating: values.rating
        }, user.access_token);
        messageApi.success('Bình luận đã được cập nhật');
      } else {
        await createComment({
          productId: id,
          commentText: values.comment,
          rating: values.rating
        }, user.access_token);
        messageApi.success('Bình luận đã được thêm');
      }
      
      setModalVisible(false);
      setEditingComment(null);
      fetchComments();
    } catch (error) {
      messageApi.error(editingComment ? 'Không thể cập nhật bình luận' : 'Không thể thêm bình luận');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId, user.access_token);
      messageApi.success('Bình luận đã được xóa');
      fetchComments();
    } catch (error) {
      messageApi.error('Không thể xóa bình luận');
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingComment(null);
  };

  return (
    <CommentContainer>
      {contextHolder}
      <div style={{ margin:  "50px 0 30px 0 "}}>
        <h1>Đánh giá sản phẩm</h1>
        <p style={{color:'#4a4a4a', lineHeight:1.5}}> {totalItems} lượt đánh giá</p>
        <Button 
          style={{backgroundColor: "red", fontWeight:450}}
          type="primary" 
          onClick={() => setModalVisible(true)}
        >
          Viết đánh giá
        </Button>
      </div>

      <CommentList
        loading={loading}
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item
            actions={[
              user?.id === comment.user._id && (
                <Space>
                  <ActionButton
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(comment)}
                  >
                  </ActionButton>
                  <Popconfirm
                    title="Bạn có chắc muốn xóa bình luận này?"
                    onConfirm={() => handleDelete(comment._id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />}
                    >
                    </Button>
                  </Popconfirm>
                </Space>
              )
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  src={comment.user.avatar} 
                  icon={<UserOutlined />}
                />
              }
              title={
                <Space>
                  <span>{comment.user.name}</span>
                  <Rate 
                    disabled 
                    defaultValue={comment.rating} 
                    character={<StarFilled />}
                  />
                </Space>
              }
              description={
                <Space direction="vertical">
                  <span>{comment.commentText}</span>
                  <DatePicker 
                    format="DD/MM/YYYY HH:mm"
                    value={moment(comment.createdAt)}
                    disabled
                  />
                </Space>
              }
            />
          </List.Item>
        )}
      />

      <div style={{ textAlign: 'center', marginTop: '20px',  display:'flex',justifyContent:'center'}}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
        />
      </div>

      <CommentModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleSubmit}
        initialValues={editingComment ? {
          rating: editingComment.rating,
          comment: editingComment.commentText
        } : null}
        loading={loading}
        isEditing={!!editingComment}
      />
    </CommentContainer>
  );
}