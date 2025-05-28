import React, { useCallback, useEffect, useState } from 'react'
import { Image } from 'antd'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ImageLogo from '../../assets/images/logo-login.webp'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Pending from '../../components/PendingComponent/Pending'
import * as message from '../../components/Message/Message'



const SignUpPage = () => {

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate()

  const handleNavigateSignIn = useCallback(() => {
    navigate('/sign-in')
  }, [])

  const mutation = useMutationHooks(
    data => UserService.signupUser(data)
  )
  const {data, isPending, isSuccess, isError} = mutation

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success(data?.message || 'Đăng ký thành công!')
      handleNavigateSignIn();
    } else if (isSuccess && data?.status === 'ERR') {
      message.error(data?.message || 'Đăng ký thất bại!')
    } else if (isError) {
      message.error('Có lỗi xảy ra, vui lòng thử lại!')
    }
  }, [isSuccess, isError, data])
  
    

  const handleOnChangeEmail = (value) => {
    setEmail(value)
  }
  const handleOnChangePassword = (value) => {
    setPassword(value)
  }
  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value)
  }

  const handleSignUp = () => {
    mutation.mutate({email, password, confirmPassword})

  }


  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgb(0, 0, 0, 0.53)', height:'100vh' }}>
      <div style={{width: '800px', height:'445px', borderRadius:'6px', background: '#fff', display: 'flex'}}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>

          <InputForm style={{marginBottom: '13px'}} placeholder='abc@gmail.com' value={email} onChange={ handleOnChangeEmail } />

          <div style={{position: 'relative', marginBottom: '13px'}}>
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

          <div style={{position: 'relative'}}>
            <span
              onClick={() => {
                setIsShowConfirmPassword(!isShowConfirmPassword)
              }}
              
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowConfirmPassword ? (
                  <EyeFilled/>
                ) : (
                  <EyeInvisibleFilled/>
                )
              }
            </span>
            <InputForm placeholder="Confirm your password" type ={isShowConfirmPassword ? 'text' : 'password'}  value={confirmPassword} onChange={ handleOnChangeConfirmPassword }/>
          </div>
          
          {data?.status==='ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
          <Pending isPending={isPending}>
            <ButtonComponent
              disabled = { !email.length || !password.length || !confirmPassword.length }

              onClick={handleSignUp}

              size={20} 
              styleButton={{ 
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px',
              }}

              textButton={'Đăng ký'}
              styleTextButton={{color: '#fff', fontSize: '15px', fontWeight: '700'}}
            />
          </Pending>
          
          <p>Bạn đã có tài khoản ? <WrapperTextLight onClick={handleNavigateSignIn}>Đăng nhập</WrapperTextLight></p>

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

export default SignUpPage;