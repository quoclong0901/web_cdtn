import React from 'react'
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperStyleTextSell,
  WrapperCardContent,
  WrapperImageBox
} from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo.webp'
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils'

const CartComponent = (props) => {
  const {
    id,
    countInStock,
    description,
    image,
    name,
    price,
    rating,
    type,
    selled,
    discount
  } = props

  const navigate = useNavigate()

  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`)
  }

  return (
    <WrapperCardStyle
      hoverable
      onClick={() => {
        if (countInStock !== 0) {
          handleDetailsProduct(id)
        }
      }}
      disabled={countInStock === 0}
    >
      <WrapperImageBox>
        <img src={image} alt='example' />
        <img
          src={logo}
          alt='logo'
          className='logo'
        />
      </WrapperImageBox>

      <WrapperCardContent>
        <StyleNameProduct title={name}>{name}</StyleNameProduct>

        <WrapperReportText>
          <span style={{ marginRight: '4px' }}>
            <span>{rating}</span>
            <StarFilled style={{ fontSize: '12px', color: '#EEC900' }} />
          </span>
          <WrapperStyleTextSell> | Đã bán {selled || 99}+</WrapperStyleTextSell>
        </WrapperReportText>

        <WrapperPriceText>
          <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>
          <WrapperDiscountText>-{discount || 0}%</WrapperDiscountText>
        </WrapperPriceText>
      </WrapperCardContent>
    </WrapperCardStyle>
  )
}

export default CartComponent
