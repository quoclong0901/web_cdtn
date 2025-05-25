import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Radio, Row, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import * as OrderService from '../../services/OrderService';
import * as PaymentService from '../../services/PaymentService';
import * as message from '../../components/Message/Message';
import Pending from '../../components/PendingComponent/Pending';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
import StepComponent from '../../components/StepComponent/StepComponent';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';


const PaymentPage = () => {

    const { Text, Title } = Typography;

  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [sdkReady, setSdkReady] = useState(false)
  
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: ''
  })
  const [form] = Form.useForm();

// %%%%%%%############&&&&&&&&&&&$$$$$$$$$$$$%%%%%%%%%%% //

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }


  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce( (total, cur) => {
      return total + (cur.price * cur.amount)
    }, 0 )

    return result
  },[order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce( (total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (priceMemo * (totalDiscount * cur.amount) /100)
    }, 0 )

    if(Number(result)) {
      return result
    }

    return 0
  },[order])

  
  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 200000 && priceMemo < 500000) {
      return 10000
    } 
    else if ( priceMemo >= 500000) {
      return 0
    }
    else {
      return 20000
    }
  },[priceMemo]) ?? 0

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  },[priceMemo, priceDiscountMemo, diliveryPriceMemo])

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests} = data
      const res = UserService.updateUser(id,{...rests}, token )
      return res
    },
  )
  const {data, isPending } = mutationUpdate

  const mutationAddOrder = useMutationHooks(
    (data) => {
    const { token, ...rests } = data
    const res = OrderService.createOrder({...rests}, token )
    return res
    },
  )
  const {isPending: isPendingAddOrder, data: dataAddOrder, isSuccess, isError} = mutationAddOrder

  const handleAddOrder = () => {
    if(user?.access_token && order?.orderItemsSelected && user?.name && user?.phone && user?.address && priceMemo && user?.id) {
        mutationAddOrder.mutate({ 
            token: user?.access_token, 
            orderItems: order?.orderItemsSelected, 
            fullName: user?.name,
            address: user?.address,
            phone: user?.phone,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: diliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
        }
      )
    }
  }

useEffect(() => {

    if(isSuccess && dataAddOrder?.status === 'OK') {
    const arrayOrdered = []
    order?.orderItemsSelected.forEach(element => {
      arrayOrdered.push(element.product)
    });
    dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))

    message.success('Đặt hàng thành công !')
  
    navigate('/orderSuccess', {
      state: {
        delivery,
        payment,
        orders: order?.orderItemsSelected,
        totalPriceMemo: totalPriceMemo
      }
    });
  }
  else if ( isError ) {
    message.error()
  }
}, [isSuccess, isError])
  

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false)
  }

  const handleUpdateInfoUser = () => {
    const {name, phone , address} = stateUserDetails
    if(name && address && phone) {
      mutationUpdate.mutate({id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({name, phone , address}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name] : e.target.value
    })
  }

  const handleDilivery = (e) => {
    setDelivery(e.target.value)
  }
  const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  const itemsDelivery =
  [
    {
        title: '20.000 ₫',
        description:'Dưới 200.000 ₫'
    },
    {
        title: '10.000 ₫',
        description:'Từ 200.000 ₫ đến Dưới 500.000 ₫',
    },
    {
        title: '0 ₫',
        description:'Trên 500.000 ₫'
    }
  ]

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate({ 
      token: user?.access_token, 
      orderItems: order?.orderItemsSelected, 
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      shippingPrice: diliveryPriceMemo,
      totalPrice: totalPriceMemo,
      user: user?.id,
      isPaid: true,
      paidAt: details?.update_time
    })
  }

  const addPaypalScript = async () => {
    const {data} = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true;
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if ( !window.paypal ) {
      addPaypalScript()
    }
    else {
      setSdkReady(true)
    }
  })
  

return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '24px 0' }}>
        <Pending isPending={isPendingAddOrder}>

        <div style={{ margin: '0 auto', width: 1270, height: '100%' }}>
            <Title level={4}>Thanh toán</Title>
            <Row gutter={24}>
              <Col span={16} style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                  <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                    <StepComponent
                      items={itemsDelivery} 
                      current={
                        diliveryPriceMemo === 20000 ? 1 :
                        diliveryPriceMemo === 10000 ? 2 :
                        order?.orderItemsSelected?.length === 0 ? 0 : 3
                      }
                    />
                  </div>
                  <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 6, marginBottom: 20 }}>
                    <Title level={5}>Chọn phương thức giao hàng</Title>
                    <Radio.Group
                      onChange={handleDilivery}
                      value={delivery}
                      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                      <Radio value="fast">
                      <Text strong style={{ color: '#fa541c' }}>FAST</Text> Giao hàng tiết kiệm
                      </Radio>
                      <Radio value="gojek">
                      <Text strong style={{ color: '#d48806' }}>GO_JEK</Text> Giao hàng tiết kiệm
                      </Radio>
                    </Radio.Group>
                  </div>

                  <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 6 }}>
                    <Title level={5}>Chọn phương thức thanh toán</Title>
                    <Radio.Group
                      onChange={handlePayment}
                      value={payment}
                      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                      <Radio value="later_money">Thanh toán tiền mặt khi nhận hàng</Radio>
                      <Radio value="paypal">Thanh toán tiền trực tuyến bằng Paypal</Radio>
                    </Radio.Group>
                  </div>
              </Col>

            {/* Right - summary */}
                <Col span={8}>
                    <div style={{ background: '#fff', padding: 16, borderRadius: 6, border: '1px solid #ddd' }}>

                        <div style={{ marginBottom: 20 }}>
                        <span> Địa chỉ giao hàng : </span> 
                        <span style={{fontWeight:'bold'}}>{`${user?.address}`} = </span>
                        <span onClick={handleChangeAddress} style={{color: 'blue', cursor: 'pointer'}}>Thay đổi</span>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span>Tạm tính:</span>
                            <span>{ convertPrice(priceMemo) }</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span>Giảm giá:</span>
                            <span>{ convertPrice(priceDiscountMemo)} </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span>Phí giao hàng:</span>
                            <span>{convertPrice(diliveryPriceMemo)}</span>
                        </div>
                        </div>

                        <h3 style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <span>Tổng tiền:</span>
                        <span style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}>
                            {convertPrice(totalPriceMemo)}
                        </span>
                        </h3>
                        
                        <p>(Đã bao gồm VAT nếu có)</p>

                        {payment === 'paypal' && sdkReady ? (
                          <PayPalScriptProvider options={{ "client-id": "AQFhu1jeFMIVRtHpfDf2T9YUnqQZwAWzGmABai6GZLA4KoAQ52-Bq1hBrWocRu40V-v_WEO9UKFAOY0d" }}>
                            <PayPalButtons
                              style={{ layout: "vertical" }}
                              createOrder={(data, actions) => {
                                return actions.order.create({
                                  purchase_units: [
                                    {
                                      amount: {
                                        value: (totalPriceMemo / 30000).toFixed(2), // 💵 tổng tiền mình muốn thanh toán
                                      },
                                    },
                                  ],
                                });
                              }}
                              onApprove={(data, actions) => {
                                return actions.order.capture().then((details) => {
                                  onSuccessPaypal(details,data);
                                });
                              }}
                              onError={() => {
                                alert('Error')
                              }}
                            />
                          </PayPalScriptProvider>
                        ) : (
                          <Button type="primary" danger block onClick={() => handleAddOrder()}>
                            Đặt hàng
                          </Button>
                        ) }

                    </div>
                </Col>
            </Row>
        </div>

        <ModalComponent
        forceRender
        title='Cập nhật thông tin giao hàng' 
        open={isOpenModalUpdateInfo} 
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfoUser}
        >
        <Pending isPending={isPending}>
            <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
            >
            <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your Name !' }]}
            >
                <InputComponent value={stateUserDetails['name']} onChange={handleOnChangeDetails} name="name"/>
            </Form.Item>

            <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone-number !' }]}
            >
                <InputComponent value={stateUserDetails?.phone} onChange={handleOnChangeDetails} name="phone"/>
            </Form.Item>

            <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your Address !' }]}
            >
                <InputComponent value={stateUserDetails?.address} onChange={handleOnChangeDetails} name="address"/>
            </Form.Item>

            </Form>
        </Pending>
        
        </ModalComponent>

        </Pending>
  </div>
  );
};

export default PaymentPage;

