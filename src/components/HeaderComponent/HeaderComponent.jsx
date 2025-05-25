import { Badge, Col, Popover} from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
// import Search from 'antd/es/transfer/search'
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService  from '../../services/UserService';
import { resetUser } from '../../redux/slides/userSlide';
import Pending from '../PendingComponent/Pending';
import { searchProduct } from '../../redux/slides/productSlide';


const HeaderComponent = ({ isHiddenSearch=false, isHiddenCart=false }) => {
    const dispatch = useDispatch()
    
    const [pending, setPending] = useState(false)
    const [ isOpenPopup , setIsOpenPopup] = useState(false)

    const navigate = useNavigate()

    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')

    const [ search, setSearch ] = useState('')

    const order = useSelector((state) => state.order)

    const user = useSelector((state) => state.user)

    const handleNavigateLogin =() => {
        navigate('/sign-in')
    }

    const handleLogout = async () => {
        setPending(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        navigate('/')
        setPending(false)
    }

    useEffect(() => {
        setPending(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setPending(false)
    }, [user?.name, user?.avatar])

    const content = (
        <div>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>Đơn hàng của tôi</WrapperContentPopup>

            <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
        </div>
    );

    const handleClickNavigate = (type) => {
        if(type == 'profile') {
            navigate('/profile-user')
        }
        else if (type == 'admin') {
            navigate('/system/admin')
        }
        else if(type == 'my-order') {
            navigate('/my-order', { state : {
                id: user?.id,
                token: user?.access_token
            }})
        }
        else {
            handleLogout()
        }

        setIsOpenPopup(false)
    }

    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch( searchProduct(e.target.value))
    } 

  return (

    <div style={{width:'100%', background:'rgb(26, 148, 255)', display: 'flex', justifyContent:'center'}}>
        <WrapperHeader gutter={16} style={{justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset'}}>
        {/* Left */}
            <Col span={5}>
                <WrapperTextHeader onClick={() => navigate('/')}>
                    N16-HieuLonH
                </WrapperTextHeader>
            </Col>
            


            {!isHiddenSearch && (
                <Col span={13}>
                    <ButtonInputSearch
                        size = "large"
                        variant = "borderless"
                        textButton = "Tìm kiếm"
                        placeholder = "input search text"
                        onChange = { onSearch }
                    />
                </Col>
            )}
        {/* Center */}
            

        {/* Right */}
            <Col span={6}  style={{display: 'flex', gap: '54px', alignItems: 'center'}}>
            
                <Pending isPending={pending}>
                    <WrapperHeaderAccount>

                        {userAvatar ? (
                            <img src={userAvatar} alt='avatar' style = {{
                                height: '30px',
                                width: '30px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}/>
                        ) : ( 
                            <UserOutlined style={{fontSize: '30px'}}/>
                        )}
                        
                        {user?.access_token ? (
                                <>
                                    <Popover content={content} trigger='click' open={isOpenPopup}>
                                        <div style={{cursor:'pointer'}} onClick={() => setIsOpenPopup((prev) => !prev)} >{userName.length ? userName : user?.email}</div>
                                    </Popover>
                                </>
                            ) : (
                                <div onClick={handleNavigateLogin} style={{cursor: 'pointer'}}>
                                    <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                                    <div>
                                        <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                        )}
                        
                    </WrapperHeaderAccount>
                </Pending>


                {!isHiddenCart && (
                    <div onClick={() => navigate('/order')} style={{cursor:'pointer'}}>
                        <Badge count={order?.orderItems?.length} size='small'>
                            <ShoppingCartOutlined style={{fontSize: '30px', color: '#fff'}}/>
                        </Badge>
                        <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                    </div>
                )}
                
            </Col>

        </WrapperHeader>
    </div>
  )
}

export default HeaderComponent;