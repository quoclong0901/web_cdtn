import React, { useEffect, useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CartComponent from '../../components/CardComponent/CardComponent'
import { Pagination, Row, Col } from 'antd'
import { WrapperNavbar, WrapperProducts } from './style'
import { useLocation } from 'react-router-dom'
import * as ProducService from '../../services/ProductService'
import Pending from '../../components/PendingComponent/Pending'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)  
  const searchDebounce = useDebounce(searchProduct, 600)
  

  const {state} = useLocation()

  const [products, setProducts] =  useState([])
  const [pending, setPending] =  useState(false)

  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 10,
    total: 1
  })

  const fetchProductType = async (type, page, limit) => {
    setPending(true)
    const res = await ProducService.getProductType(type, page, limit)

    if (res?.status === 'OK') {
      setPending(false)
      setProducts(res?.data)
      setPanigate({...panigate, total: res?.totalPage})
    
    }else {
      setPending(false)
    }
    
  }

  useEffect(() => {
    if (state) {
      fetchProductType(state, panigate.page, panigate.limit)

    }
  },[state, panigate.page, panigate.limit])

  const onChange = (current, pageSize) => {
    setPanigate({...panigate, page: current - 1, limit: pageSize})
    
  }

  return (
    <Pending isPending={pending}>
      <div style={{width: '100%', background: '#efefef', height: 'calc(100vh - 64px)'}}>
        <div style={{width: '1270px', margin: '0 auto', height: '100%'}}>

          <Row style={{flexWrap: 'nowrap', paddingTop: '10px', height: 'calc(100% - 20px)'}}>
            {/* <WrapperNavbar span={4} >
                <NavbarComponent />
            </WrapperNavbar> */}

            <Col span={24} style={{display:'flex' , flexDirection: 'column', justifyContent: 'space-between'}}>
              <WrapperProducts >
                {products?.filter((pro) => {
                  if(searchDebounce === '') {
                    return pro
                  } else if ( pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase() ) ){
                    return pro
                  }
                })?.map((product) => {
                  return (
                    <CartComponent 
                      key={product._id}
                      countInStock = {product.countInStock}
                      description = {product.description}
                      image = {product.image}
                      name = {product.name}
                      price = {product.price}
                      rating = {product.rating}
                      type = {product.type}
                      selled = {product.selled}
                      discount = {product.discount}
                      id = {product._id}
                    />
                  )
                })}
              </WrapperProducts>

              <Pagination defaultCurrent={panigate.page + 1} total={panigate?.total} onChange={onChange} style={{justifyContent: 'center', marginTop: '10px'}} />
            </Col>
            
          </Row>
        </div>
        

      </div>
    </Pending>
    
    

  )
}

export default TypeProductPage
