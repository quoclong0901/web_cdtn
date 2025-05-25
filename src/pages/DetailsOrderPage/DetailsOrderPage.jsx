import React, { useEffect, useMemo } from 'react';
import {
  WrapperHeaderUser,
  WrapperContentInfo,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperNameProduct,
  WrapperProduct,
  WrapperStyleContent,
  WrapperTotal
} from './style';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';
import Pending from '../../components/PendingComponent/Pending';

const DetailsOrderPage = () => {

    const params = useParams()
    const location = useLocation()
    const { state } = location
    const { id } = params
    
    const fetchDetailsOrder = async () => {
        const res = await OrderService.getDetailsOrder(id, state?.token)
        return res.data 
    } 

    const queryOrder = useQuery({
        queryKey: ['orders-details', id],
        queryFn: fetchDetailsOrder,
        enabled: !!(id && state?.token)
    });    
    const { isPending, data } = queryOrder
    // const {shippingAddress ='', orderItems='', shippingPrice='', paymentMethod='', isPaid=false, totalPrice=''  } = data
    
    const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce( (total, cur) => {
        return (total + (cur.price * cur.amount))
    }, 0 )

    return result
    },[data])

  return (
    <Pending isPending={isPending}>
    <div style={{ width: '100%', height: '100vh', background: '#f5f5fa' }}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h2 style={{fontWeight:'bold'}}>Chi tiết đơn hàng</h2>

        {/* Thông tin người nhận, giao hàng, thanh toán */}
        <WrapperHeaderUser>
          {/* Người nhận */}
          <WrapperInfoUser>
            <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
            <WrapperContentInfo>
              <div className="name-info">Tên: <span style={{color: 'red'}}> { data?.shippingAddress?.fullName }</span></div>
              <div className="address-info"><span>Địa chỉ: </span>{ data?.shippingAddress?.address } </div>
              <div className="phone-info"><span>Điện thoại: </span>{ data?.shippingAddress?.phone }</div>
            </WrapperContentInfo>
          </WrapperInfoUser>

          {/* Giao hàng */}
          <WrapperInfoUser>
            <WrapperLabel>Hình thức giao hàng</WrapperLabel>
            <WrapperContentInfo>
              <div className="delivery-info"><span className="name-delivery">FAST </span>Giao hàng tiết kiệm</div>
              <div className="delivery-fee"><span>Phí giao hàng: </span>{ data?.shippingPrice }</div>
            </WrapperContentInfo>
          </WrapperInfoUser>

          {/* Thanh toán */}
          <WrapperInfoUser>
            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
            <WrapperContentInfo>
              <div className="payment-method">{ orderContant[data?.paymentMethod] }</div>
              <div className="payment-status" style={{ color: 'orange' }}> { data?.isPaid ?'Đã thanh toán' : 'Chưa thanh toán' } </div>
            </WrapperContentInfo>
          </WrapperInfoUser>
        </WrapperHeaderUser>

        {/* Danh sách sản phẩm */}
        {data?.orderItems?.map((order) => {        
            return (
                <WrapperStyleContent>
                    <WrapperProduct>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                            src={order?.image}
                            alt="product"
                            style={{ width: 60, height: 60 }}
                        />
                        <WrapperNameProduct>{order?.name}</WrapperNameProduct>
                        </div>
                    </WrapperProduct>

                    <WrapperItem>
                        <WrapperItemLabel>Giá</WrapperItemLabel>
                        <div>{ convertPrice(order?.price)}</div>
                    </WrapperItem>

                    <WrapperItem>
                        <WrapperItemLabel>Số lượng</WrapperItemLabel>
                        <div>{order?.amount}</div>
                    </WrapperItem>

                    <WrapperItem>
                        <WrapperItemLabel>Giảm giá</WrapperItemLabel>
                        <div>{order?.discount ? convertPrice(priceMemo * order?.discount / 100) : '0 ₫'}</div>
                    </WrapperItem>

                </WrapperStyleContent>
            )
        })}

        <WrapperTotal>
        <div>
            <div className="total-line subtotal">
                <div className="label">Tạm tính</div>
                <div>{convertPrice(priceMemo)}</div>
            </div>
            <div className="total-line shipping">
                <div className="label">Phí vận chuyển</div>
                <div>{ convertPrice(data?.shippingPrice) }</div>
            </div>
            <div className="total-line total">
                <div className="label">Tổng cộng</div>
                <div style={{ color: 'red', fontWeight: 600 }}>{convertPrice(data?.totalPrice)}</div>
            </div>
        </div>
        </WrapperTotal>

      </div>
    </div>
    </Pending>

  );
};

export default DetailsOrderPage;
