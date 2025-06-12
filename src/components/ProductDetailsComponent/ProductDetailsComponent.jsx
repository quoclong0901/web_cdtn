import { Col, Image, Rate, Row } from 'antd'
import React, { useState } from 'react'
import { WrapperInputNumber, WrapperPriceProduct, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import * as ProductService from '../../services/ProductService'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { useQuery } from '@tanstack/react-query'
import Pending from '../PendingComponent/Pending'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'
import CommentProduct from '../Comment/CommentProduct'

const ProductDetailsComponent = ({idProduct}) => {
  
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  
  const [numProduct, setNumProduct ] = useState(1)

  const [visible, setVisible] = useState(false)

  const user = useSelector((state) => state.user)

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    
    if(id) {
      const res = await ProductService.getDetailsProduct(id)

      return res.data;
    }

  }

  const {isPending, data: productDetails } = useQuery({
    queryKey: ['product-details', idProduct],
    queryFn: (context) => fetchGetDetailsProduct(context), 
    enabled: !!idProduct
  })

  const handleChangeCount = (type) => {
    if (type === 'increase') {
      // setNumProduct((prev) => prev + 1)
      setNumProduct(numProduct + 1)
    }
    else {
      // setNumProduct((prev) => prev - 1)
      setNumProduct(numProduct - 1)
    }
  }

  const handleAddOrderProduct = () => {
    if(!user.id) {
      navigate('/sign-in', {state: location?.pathname})
    } else {
      dispatch(addOrderProduct({
        orderItem: {
          name: productDetails?.name,
          amount: numProduct,
          image: productDetails?.image,
          price: productDetails?.price,
          product: productDetails?._id,
          discount: productDetails?.discount,
          countInStock: productDetails?.countInStock,
          description: productDetails?.description,
          selled: productDetails?.selled
        }
      }))
    }
  }
  
  return (
    <Pending isPending={isPending}>
      <Row style={{padding: '16px', background: '#fff', borderRadius: '4px'}}>
        {/* hiển thị ảnh chiếm 10/24 phần của grid */}
        <Col
          xs={24}
          md={10}
          style={{
            marginBottom: '16px',
            paddingRight: '8px',
            borderRight: '1px solid #e5e5e5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Image.PreviewGroup>
            {/* Ảnh lớn */}
            <div
              style={{
                width: '300px',
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #e5e5e5',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <Image
                src={productDetails?.image}
                alt="image product"
                preview={{ visible: false }} // Tắt preview mặc định để không hiện ngay
                onClick={() => setVisible(true)} // Thêm state nếu muốn điều khiển
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  cursor: 'zoom-in'
                }}
              />
            </div>

            {/* Danh sách ảnh nhỏ (thumbnails) */}
            <Row
              gutter={[8, 8]}
              style={{
                paddingTop: '10px',
                justifyContent: 'center',
                width: '100%',
                marginTop: '12px'
              }}
            >
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <Col key={index} xs={8} sm={4}>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        overflow: 'hidden',
                        border: '1px solid #e5e5e5',
                        borderRadius: '4px',
                        margin: '0 auto'
                      }}
                    >
                      <Image
                        src={productDetails?.image}
                        alt={`thumbnail ${index}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'zoom-in'
                        }}
                      />
                    </div>
                  </Col>
                ))}
            </Row>
          </Image.PreviewGroup>
        </Col>

        {/* Phần nội dung chiếm 14/24 phần grid */}
        <Col xs={24} md={14} style={{paddingLeft: '10px'}}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
          {/* Tên sản phẩm */}
          <WrapperStyleNameProduct style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>
            {productDetails?.name}
          </WrapperStyleNameProduct>

          {/* Đánh giá + số lượng đã bán */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Rate allowHalf disabled value={productDetails?.rating} />
            <WrapperStyleTextSell style={{ fontSize: '14px', color: '#888' }}>
              | Đã bán {productDetails?.selled || 50} sản phẩm
            </WrapperStyleTextSell>
          </div>

          <br/>

          {/* Giá sản phẩm */}
          <WrapperPriceProduct style={{ fontSize: '24px', fontWeight: 'bold', color: '#e53935', marginBottom: '12px' }}>
            {convertPrice(productDetails?.price)}
          </WrapperPriceProduct>
              
            <br/>

          {/* Mô tả sản phẩm */}
          {productDetails?.description && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>Mô tả sản phẩm:</div>
              <div style={{ fontSize: '14px', color: '#555', lineHeight: 1.6 }}>
                {productDetails.description}
              </div>
            </div>
          )}

          <br/>

          {/* Chọn số lượng */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontWeight: 500 }}>Số lượng:</span>
            <button
              style={{
                border: 'none',
                background: 'transparent',
                cursor: numProduct <= 1 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => handleChangeCount('decrease')}
              disabled={numProduct <= 1}
            >
              <MinusOutlined style={{ color: numProduct <= 1 ? '#ccc' : '#000', fontSize: '20px' }} />
            </button>

            <WrapperInputNumber min={1} max={99} value={numProduct}/>

            <button
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              onClick={() => handleChangeCount('increase')}
            >
              <PlusOutlined style={{ fontSize: '20px' }} />
            </button>
          </div>

          {/* Nút chọn mua */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginTop: '50px'
          }}>
            <ButtonComponent
              size={20}
              styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                minWidth: '180px',
                flex: '1 1 200px',
                border: 'none',
                borderRadius: '4px',
              }}
              onClick={handleAddOrderProduct}
              textButton={'Chọn Mua'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            />
          </div>
        </div>


        </Col>
        <CommentProduct/>
      </Row>
    </Pending>
    

  )

}

export default ProductDetailsComponent