import React, { useEffect, useState } from 'react'
import { Image } from 'antd'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ImageLogo from '../../assets/images/logo-login.webp'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Pending from '../../components/PendingComponent/Pending'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'



const SignInPage = () => {

  const [isShowPassword, setIsShowPassword] = useState(false);
  const location = useLocation()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch()

  const navigate = useNavigate()
  const handleNavigateSignUp =() => {
    navigate('/sign-up')
  }

  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )

  const {data, isPending, isSuccess} = mutation

  useEffect(()=> {
    
    if(isSuccess) {
      if(location?.state) {
        navigate(location?.state)
      } else {
        navigate('/')
      }

      localStorage.setItem('access_token', JSON.stringify(data?.access_token) )// lưu access_token vào localStorage
      if(data?.access_token) {
        const decoded = jwtDecode(data?.access_token)
        
        if(decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    }

  }, [isSuccess])
  
  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser( { ...res?.data, access_token: token } ) )
  }

  const handleOnChangeEmail = (value) => {
    setEmail(value)
  }
  const handleOnChangePassword = (value) => {
    setPassword(value)
  }

  const handleSignIn = () => {
    mutation.mutate({
      email,
      password
    })
    
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgb(0, 0, 0, 0.53)', height:'100vh' }}>
      <div style={{width: '800px', height:'445px', borderRadius:'6px', background: '#fff', display: 'flex'}}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>

          <InputForm style={{marginBottom: '10px'}} placeholder='abc@gmail.com' value={email} onChange={ handleOnChangeEmail }/>
          <div style={{position: 'relative'}}>
            <span
              onClick={() => {
                setIsShowPassword(!isShowPassword)
              }}

              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (
                  <EyeFilled/>
                ) : (
                  <EyeInvisibleFilled/>
                )
              }
            </span>
            <InputForm placeholder="Enter your password" type ={isShowPassword ? 'text' : 'password'} value={password} onChange={ handleOnChangePassword }/>
          </div>

          {data?.status === 'ERR' && <span style={{color:'red'}}>{data?.message}</span>}

          <Pending isPending={isPending}>
            <ButtonComponent

              disabled = { !email.length || !password.length }

              onClick={handleSignIn}

              size={20} 
              styleButton={{ 
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px',
              }}

              textButton={'Đăng nhập'}
              styleTextButton={{color: '#fff', fontSize: '15px', fontWeight: '700'}}
            />
          </Pending>

          <p><WrapperTextLight>Quên Mật khẩu</WrapperTextLight></p>
          <p>
            Chưa có tài khoản ? 
            <WrapperTextLight onClick={handleNavigateSignUp}>
              Tạo tài khoản
            </WrapperTextLight>
          </p>

        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={ImageLogo} preview={false} alt='image-logo' height='203px' width='203px'/>
          <h4>
            Mua sắm tại N16-HieuLong
          </h4>
        </WrapperContainerRight>
      </div>
    </div>
    
  )
}

export default SignInPage
