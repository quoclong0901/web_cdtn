import React from 'react';
import { Col, Typography } from 'antd';
import Pending from '../../components/PendingComponent/Pending';
import { WrapperValue } from './style';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';


const OrderSuccess = () => {
  const { Text, Title } = Typography;

  const location = useLocation()
  const {state} = location
  
  return (
    <div style={{ backgroundColor: '#f5f5f5', width: '100%', height: '100vh' }}>
        <Pending isPending={false}>

        <div style={{ margin: '0 auto', width: 1270, height: '100%' }}>
            <Title level={4}>Đơn hàng đã đặt thành công</Title>
            <div style={{display:'flex', justifyContent: 'center'}}>
                <Col span={20} style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                    <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 6, marginBottom: 20 }}>
                        <Title level={5}>Phương thức giao hàng</Title>
                        <WrapperValue>
                          <span style={{ color: '#fa541c', fontWeight:'bold' }}>{orderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                        </WrapperValue>
                    </div>

                    <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 6, marginBottom: 20}}>
                        <Title level={5}>Phương thức thanh toán</Title>
                        <WrapperValue>                        
                          {orderContant.payment[state?.payment]} 
                        </WrapperValue>
                    </div>

                    <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 6, marginBottom: 20}}>
                      <div style={{ display: 'flex', marginTop: 10, marginBottom:10, fontWeight: 'bold', color: '#888', alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ width: '50%' }}>Sản phẩm</div>
                        <div style={{ width: '25%' }}>Đơn giá</div>
                        <div style={{ width: '25%' }}>Số lượng</div>
                      </div>

                      {state.orders?.map((order) => {
                        return (
                          <div
                            key={order?.name}
                            style={{
                              background: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              padding: '10px 0',
                              borderBottom: '5px solid #eee',
                              marginBottom: '16px',
                            }}
                          > 
                  {/* Tên */}
                            <div style={{ width: '50%', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <img src={order?.image} alt="" width={70} height={70} style={{ objectFit: 'cover' }} />
                              <span style={{paddingLeft: 4, paddingRight: 16, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{order?.name}</span>
                            </div>
    
                    {/* Gía */}
                            <div style={{ width: '25%' }}>{ convertPrice(order?.price)}</div>
    
                    {/* Số lượng */}
                            <div style={{width: '25%',display: 'flex', alignItems: 'center', gap: 4 }}>
                              {order?.amount}
                            </div>
                          </div>
                        )
                      })}

                    {/* Tổng tiền */}
                      <div style={{  display: 'flex', alignItems: 'center', gap: 4, fontSize: '18px', fontWeight:'bold', color:'red' }}>
                        Tổng tiền: {convertPrice(state?.totalPriceMemo)}
                      </div>

                    </div>
                </Col>
            </div>
        </div>

        </Pending>
  </div>
  );
};

export default OrderSuccess;

