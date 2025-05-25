import { Col, Image, Rate, Row } from 'antd'
import React, { useState } from 'react'
import imageProduct from '../../assets/images/test.webp'
import imageProductSmall from '../../assets/images/imagesmall.webp'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons'
import * as ProductService from '../../services/ProductService'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { useQuery } from '@tanstack/react-query'
import Pending from '../PendingComponent/Pending'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'

const ProductDetailsComponent = ({idProduct}) => {
  
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [numProduct, setNumProduct ] = useState(1)

  const user = useSelector((state) => state.user)
  
  const onChange = (value) => {
    setNumProduct(Number(value))
  }

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
        // {
        //     name: { type: String, required: true },
        //     amount: { type: Number, required: true },
        //     image: { type: String, required: true },
        //     price: { type: Number, required: true },
        //     product: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Product',
        //     required: true,
        //     },
        // },
      dispatch(addOrderProduct({
        orderItem: {
          name: productDetails?.name,
          amount: numProduct,
          image: productDetails?.image,
          price: productDetails?.price,
          product: productDetails?._id,
          discount: productDetails?.discount,
          countInStock: productDetails?.countInStock,
          description: productDetails?.description
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
          <div
            style={{
              width: '300px',
              height: '400px',
              // backgroundColor: '#f5f5f5',
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
              preview={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain' // hoặc 'cover' nếu bạn muốn ảnh lấp đầy khung
              }}
            />
          </div>

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
                      preview={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </Col>
              ))}
          </Row>
        </Col>

        {/* Phần nội dung chiếm 14/24 phần grid */}
        <Col xs={24} md={14} style={{paddingLeft: '10px'}}>
          <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>

      {/* Sao đánh giá - đã bán */}
          <div>
            <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />

            <WrapperStyleTextSell> | Đã bán 50 sản phẩm</WrapperStyleTextSell>
          </div>

      {/* Giá */}
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
          </WrapperPriceProduct>

      {/* địa chỉ */}
          <WrapperAddressProduct>
            <span> Giao đến </span>
            <span className='address'> {user?.address} </span> 
            {/* - 
            <span className='change-address'> Đổi địa chỉ </span> */}
          </WrapperAddressProduct>

      {/* Số lượng */}
          <div style={{margin: '10px 0 20px',padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5'}}>
            <div style={{marginBottom: '12px'}}>Số lượng</div>

            <WrapperQualityProduct>
              <button style={{border: 'none', background: 'transparent', cursor:'pointer'}} onClick={() => handleChangeCount('decrease')}>
                <MinusOutlined style={{color: '#000', fontSize: '20px'}} />
              </button>
              
              <WrapperInputNumber onChange={onChange} defaultValue={1} value={numProduct} size='small'/>
              
              <button style={{border: 'none', background: 'transparent', cursor:'pointer'}} onClick={() => handleChangeCount('increase')}>
                <PlusOutlined style={{color: '#000', fontSize: '20px'}}  />
              </button>
              
            </WrapperQualityProduct>

          </div>

      {/* 2 button mua */}
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
            {/* <ButtonComponent
              size={20}
              styleButton={{
                background: '#fff',
                height: '48px',
                minWidth: '180px',
                flex: '1 1 200px',
                border: '2px solid rgb(13, 92, 182)',
                borderRadius: '4px',
              }}
              textButton={'Mua trả sau'}
              styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
            /> */}
          </div>

        </Col>

      </Row>
    </Pending>
    

  )

}

export default ProductDetailsComponent