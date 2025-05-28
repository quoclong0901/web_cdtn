import React, { useEffect, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import { ColorBox, InfoBar, InfoItem, WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slider1 from '../../assets/images/slider1.webp';
import slider2 from '../../assets/images/slider2.webp';
import slider3 from '../../assets/images/slider3.webp';
import home_img from '../../assets/images/home_img.webp';
import CardComponent from '../../components/CardComponent/CardComponent';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux';
import Pending from '../../components/PendingComponent/Pending';
import { useDebounce } from '../../hooks/useDebounce';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import SliderComponentY from '../../components/SliderComponentY/SliderComponentY';
import { Row } from 'antd';
import './HomePage.css'
import { CarFilled, CheckCircleFilled, InteractionFilled, MoneyCollectFilled, PoundCircleFilled, RetweetOutlined } from '@ant-design/icons';

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 600)

  const [pending, setPending] = useState(false)
  const [limit, setLimit] = useState(1000) // Lấy đủ dữ liệu để chia theo type
  const [typeProducts, setTypeProducts] = useState([])

  // State để lưu limit hiển thị riêng cho mỗi type
  const [typeLimits, setTypeLimits] = useState({})

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const { isPending, data: products } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: (context) => fetchProductAll(context),
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true
  })

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') {
      setTypeProducts(res?.data)
      // Khởi tạo limit mặc định cho mỗi type
      const initialLimits = {}
      res?.data?.forEach(type => {
        initialLimits[type] = 5
      })
      setTypeLimits(initialLimits)
    }
  }

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  // Sản phẩm nổi bật
  const topProducts = products?.data
    ?.slice()
    ?.sort((a, b) => (b.selled || 0) - (a.selled || 0))
    ?.slice(0, 4)

  // Sản phẩm theo type
  const productsByType = typeProducts.reduce((acc, type) => {
    acc[type] = products?.data?.filter(product => product.type === type) || []
    return acc
  }, {})

  const handleLoadMoreType = (type) => {
    setTypeLimits(prev => ({
      ...prev,
      [type]: prev[type] + 5
    }))
  }

  return (
    <Pending isPending={isPending || pending}>
      <div className='body' style={{ width: '100%', height: '100%', backgroundColor: '#efefef' }}>
      <div id='container' style={{ width: '1270px', margin: "0 auto", paddingBottom: '15px', marginTop: '10px' }}>
        <ColorBox>
        <WrapperTypeProduct>
          {typeProducts.map((item) => {
            return (
              <TypeProduct name={item} key={item} />
            )
          })}
        </WrapperTypeProduct>
        </ColorBox>
      </div>
      </div>

      <div className='body' style={{ width: '100%', height: '100%', backgroundColor: '#efefef' }}>
        <div id='container' style={{ width: '1270px', margin: "0 auto", paddingBottom: '30px' }}>
          <SliderComponentY />
          <SliderComponent arrImages={[slider1, slider2, slider3]} />

          <InfoBar>
            <InfoItem><CheckCircleFilled /> 100% chính hãng</InfoItem>
            <InfoItem><MoneyCollectFilled /> Giá ưu đãi</InfoItem>
            <InfoItem><CarFilled /> Miễn phí vận chuyển</InfoItem>
            <InfoItem><InteractionFilled /> Đổi trả lên đến 30 ngày</InfoItem>
            <InfoItem><PoundCircleFilled /> Thanh toán linh hoạt</InfoItem>
          </InfoBar>

          {/* Sản phẩm nổi bật */}
          <div style={{
            backgroundColor: '#d70018', // đỏ nổi bật
            borderRadius: '4px',
            padding: '20px',
            marginTop: '30px',
            textAlign: 'center',
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '22px',
              fontWeight: 'bold',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}>
              🔥 DEAL HOT HÔM NAY
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '36px',
              flexWrap: 'wrap',
            }}>
              {topProducts?.map((product) => (
                <div key={product._id} style={{
                  borderRadius: '8px',
                  padding: '10px',
                  width: '235px',
                }}>
                  <CardComponent {...product} id={product._id} />
                </div>
              ))}
            </div>
          </div>

          <img src={home_img} alt=""  style={{
            width: '1270px',
            marginTop: 10,
            border: '1px solid blue'
          }}/>

          {/* Hiển thị sản phẩm theo type với từng nhóm limit riêng */}
          {Object.entries(productsByType)?.map(([type, items]) => (
            <div key={type} style={{ marginTop: '40px' }}>
              {/* <h2 style={{background: '#1d34c4', color: 'red', fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>
                {type}
              </h2> */}

              <div key={type}>
                <div className="category-banner">
                  <span className="category-title">{type}</span>
                </div>

                {/* List sản phẩm type này */}
                <Row gutter={[16, 16]}>
                  <WrapperProducts>
                    {items.slice(0, typeLimits[type] || 5).map((product) => (
                      <CardComponent
                        key={product._id}
                        {...product}
                        id={product._id}
                      />
                    ))}
                  </WrapperProducts>
                </Row>
              </div>

              {items.length > (typeLimits[type] || 5) && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  <WrapperButtonMore
                    textButton='Xem thêm'
                    type='outline'
                    styleButton={{
                      border: '1px solid rgb(11, 116, 229)',
                      color: 'rgb(11, 116, 229)',
                      width: '240px',
                      height: '38px',
                      borderRadius: '4px',
                    }}
                    styleTextButton={{
                      fontWeight: '500',
                      color: 'rgb(11, 116, 229)'
                    }}
                    onClick={() => handleLoadMoreType(type)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <FooterComponent />
      </div>
    </Pending>
  )
}

export default HomePage;
