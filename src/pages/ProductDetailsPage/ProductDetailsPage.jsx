import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useNavigate, useParams } from 'react-router-dom'
import SliderComponentY from '../../components/SliderComponentY/SliderComponentY'

const ProductDetailsPage = () => {

  const {id} = useParams()
  const navigate = useNavigate()

  return (
    <div style={{width: '100%', background: '#efefef', height:'100%'}}>
      <div style={{width: '1270px', height: '100%', margin:'0 auto'}}>
        
        <SliderComponentY/>
        
        <h2 style={{ paddingTop: '10px'}}><span style={{cursor: 'pointer', fontWeight: 'bold'}} onClick={() => {navigate('/')}}>Trang chủ</span> - Chi tiết sản phẩm</h2>

        <ProductDetailsComponent idProduct = {id}/>
      </div>
  
    </div>
  )
}

export default ProductDetailsPage
