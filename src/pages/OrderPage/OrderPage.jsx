import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, InputNumber, Button, Form, Row, Col} from 'antd';
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import * as message from '../../components/Message/Message';
import Pending from '../../components/PendingComponent/Pending';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import StepComponent from '../../components/StepComponent/StepComponent';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slider1 from '../../assets/images/slider1.webp';
import slider2 from '../../assets/images/slider2.webp';
import slider3 from '../../assets/images/slider3.webp';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import SliderComponentY from '../../components/SliderComponentY/SliderComponentY';


const OrderPage = () => {

  const [listChecked, setListChecked] = useState([])

  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // %%%%%%%############&&&&&&&&&&&$$$$$$$$$$$$%%%%%%%%%%% //
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: ''
  })
  const [form] = Form.useForm();
  


  const handleChangeCount = (type, idProduct, limited) => {
    if(type ==='increase') {
      if( !limited ) { 
        dispatch(increaseAmount({idProduct}))
      }
      
    } else {
      if ( !limited ) {
        dispatch(decreaseAmount({idProduct}))
      }
    }
  }

  const onChange = (e) => {
    if(listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    } else {
      setListChecked([...listChecked, e.target.value])
    }
  }
  
  
  useEffect(() => {
    dispatch(selectedOrder({listChecked}))
  }, [listChecked])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        ...stateUserDetails,
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const handleOnchangeCheckAll = (e) => {
    if(e.target.checked) {
      const newListChecked = []

      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      });

      setListChecked(newListChecked)
    } else {
      setListChecked([])
    }
    
  }

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({idProduct}))
  };

  const handleRemoveAllOrder = () => {

    if ( listChecked.length > 1 ) {
      dispatch(removeAllOrderProduct({listChecked}))
    }
  }

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce( (total, cur) => {
      return (total + (cur.price * cur.amount))
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
    else if (order?.orderItemsSelected?.length === 0 ) {
      return 0
    }
    else {
      return 20000
    }
  },[priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  },[priceMemo, priceDiscountMemo, diliveryPriceMemo])

  const handleAddCard = () => {

    if ( !order?.orderItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm!");
    }
    else if (!user?.phone || !user?.address || !user?.name) {
      setIsOpenModalUpdateInfo(true)
    }
    else {
      navigate('/payment')
    }
    
  }

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests} = data
      const res = UserService.updateUser(id,{...rests}, token )
      return res
    },
  )
  const {data, isPending } = mutationUpdate

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
      // avatar: '',
      // address: ''
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
  

  return (

  <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '24px 0' }}>
    <div style={{ margin: '0 auto', width: '1270px', height: '100%' }}>
      <h2>Giỏ hàng</h2>
      <SliderComponentY/>
      <Row style={{ display: 'flex', gap: 10, paddingLeft: '10px' }}>
        {/* LEFT */}
        <Col span={17} style={{marginRight: 16, marginLeft: '10px'}}>
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

          <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked.length === order?.orderItems?.length}>Tất cả ({order?.orderItems?.length} sản phẩm)</Checkbox>

            <div style={{ display: 'flex', marginTop: 10, fontWeight: 'bold', color: '#888', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ width: '46%' }}>Sản phẩm</div>
              <div style={{ width: '15%', marginLeft: 20  }}>Đơn giá</div>
              <div style={{ width: '11%' }}>Số lượng</div>
              <div style={{ width: '17%', marginLeft: 20 }}>Thành tiền</div>
              <DeleteOutlined style={{ width: '10%', cursor:'pointer' }} onClick={handleRemoveAllOrder}/>
            </div>

            {order?.orderItems?.map((order) => {
              return (
                <div
                  key={order?.product}
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
                  <div style={{ width: '46%', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}/>
                    <img src={order?.image} alt="" width={70} height={70} style={{ objectFit: 'cover' }} />
                    <span style={{ paddingRight: 16, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{order?.name}</span>
                  </div>

          {/* Gía */}
                  <div style={{ width: '15%' }}>{convertPrice(order?.price)}</div>

          {/* Số lượng */}
                  <div style={{ width: '11%', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Button
                      size="small"
                      icon={<MinusOutlined min={1}/>}
                      onClick={() => handleChangeCount('decrease', order?.product, order?.amount === 0 )}
                    />
                    <InputNumber
                      size="small"
                      min={1}
                      max = {order?.countInStock}
                      defaultValue={order?.amount}
                      value={order?.amount}
                    />
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => handleChangeCount('increase', order?.product, order?.amount === order?.countInStock)}
                    />
                  </div>

          {/* Thành tiền */}
                  <div style={{ width: '17%', color: 'red', fontWeight: 500 , marginLeft: 20}}>
                    { convertPrice(order?.price * order?.amount) }
                  </div>

          {/* Button Xóa */}
                  <div style={{ width: '10%' }}>
                    <DeleteOutlined
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteOrder(order?.product)}
                    />
                  </div>
                </div>
              )
          })}
          </div>
        </Col>

        {/* Right - summary */}
        <Col span={6}>
          <div style={{ background: '#fff', padding: 20 }}>

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
                <span>{ convertPrice(priceDiscountMemo) } </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Phí giao hàng:</span>
                <span>{convertPrice(diliveryPriceMemo)}</span>
              </div>
            </div>

            <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tổng tiền:</span>
              <span style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}>
                {convertPrice(totalPriceMemo)}
              </span>
            </h3>
            
            <p>(Đã bao gồm VAT nếu có)</p>

            <Button type="primary" danger block onClick={() => handleAddCard()}>
              Mua hàng
            </Button>
          </div>
        </Col>
      </Row>
    <div style={{margin: 20}}>
      <SliderComponent arrImages={[slider1, slider2, slider3 ]}/>  
    </div>

    <div style={{marginRight: '20px', marginLeft: '20px'}}>
      <FooterComponent/>
    </div>
    
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
  </div>
  );
};

export default OrderPage;

