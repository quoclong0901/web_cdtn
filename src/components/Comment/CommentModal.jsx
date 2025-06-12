import React, { useEffect } from 'react';
import { Modal, Form, Input, Rate, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { TextArea } = Input;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }
`;

const CommentModal = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  initialValues,
  loading,
  isEditing = false
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues ) {
      form.setFieldsValue(initialValues);    
    } else {
      form.resetFields();   
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa đánh giá" : "Đánh giá sản phẩm"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          icon={<SendOutlined />}
        >
          {isEditing ? "Cập nhật" : "Gửi đánh giá"}
        </Button>
      ]}
    >
      <StyledForm
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="rating"
          label="Đánh giá của bạn"
          rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
        >
          <Rate />
        </Form.Item>
        
        <Form.Item
          name="comment"
          rules={[{ required: true, message: 'Vui lòng nhập bình luận' }]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập bình luận của bạn..."
          />
        </Form.Item>
      </StyledForm>
    </Modal>
  );
};

export default CommentModal; 