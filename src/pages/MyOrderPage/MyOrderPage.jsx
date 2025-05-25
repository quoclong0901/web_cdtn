import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import * as OrderService from '../../services/OrderService'
import Pending from "../../components/PendingComponent/Pending";
import { Card, Row, Col, Typography, Image, Divider, Button } from 'antd';
import { convertPrice } from "../../utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message'

const MyOrderPage = () => {
  const { Text, Title } = Typography;
  const navigate = useNavigate()
  const location = useLocation()
  const {state} = location

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token)
    return res.data || []
  } 

  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    enabled: !!(state?.id && state?.token)
  });    
  const { isPending, data } = queryOrder

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      }
    })
  }

  const mutation = useMutationHooks(
    (data) => {
      const {id, token, orderItems} = data
      const res = OrderService.cancelOrder(id, token, orderItems)
      return res
    }
  )
  const handleCancelOrder = (order) => {
    mutation.mutate({id: order._id, token: state?.token, orderItems: order?.orderItems} , {
      onSuccess: () => {
        queryOrder.refetch()
      }
    })
  }
  const {isPending: isPendingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel} = mutation

  useEffect (() => {
    if(isSuccessCancel && dataCancel?.status === 'OK') {
      message.success()
    } else if ( isErrorCancel) {
      message.error()
    }
  }, [isSuccessCancel, isErrorCancel])

  const renderProduct = (data) => {
    return ( data?.map((order) => {
      return (
        <Row align="middle">
          <Col>
            <Image
              src={order?.image}
              width={60}
              height={60}
              style={{ objectFit: 'cover' }}
              preview={false}
            />
          </Col>
          <Col flex="auto" style={{ paddingLeft: 16 }}>
            <Text strong>{order?.name}</Text>
          </Col>
          <Col>
            <Text>{convertPrice(order?.price)}</Text>
          </Col>
        </Row>
      )})
    )
  }


  return (
    <Pending isPending={isPending || isPendingCancel}>
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '24px 0' }}>
        <div style={{ margin: '0 auto', width: 1270, height: '100%' }}>
          <Title level={4}>Đơn hàng của tôi</Title>

          {Array.isArray(data) && data?.slice().reverse().map((order) => {
            return (
              <div key={order?._id}>
                <Card style={{ maxWidth: 1000, margin: '0 auto', marginBottom: '16px' }}>
                  {/* Trạng thái đơn hàng */}
                  <div style={{ marginBottom: 16 }}>
                    <div><span style={{color:'rgb(255, 66, 78)'}}>Giao hàng: </span> {`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`} </div>
                    <div><span style={{color:'rgb(255, 66, 78)'}}>Thanh toán: </span> {`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`} </div>
                  </div>

                  <Divider />

                  {/* Chi tiết sản phẩm */}
                  {renderProduct(order?.orderItems)}

                  <Divider />

                  {/* Tổng tiền + nút */}
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text style={{ color: '#ff4d4f', fontWeight: 500 }}>
                        Tổng tiền: <Text strong style={{ color: '#000' }}>{convertPrice(order?.totalPrice)}</Text>
                      </Text>
                    </Col>
                    <Col>
                      <Button danger style={{ marginRight: 8 }} onClick={() => handleCancelOrder(order)}>Hủy đơn hàng</Button>
                      <Button type="primary" onClick={() => handleDetailsOrder(order?._id)}>Xem chi tiết</Button>
                    </Col>
                  </Row>
                </Card>
              </div>
              
            )
          })
          }    
        </div>
      </div>
    </Pending>
  )
}

export default MyOrderPage;