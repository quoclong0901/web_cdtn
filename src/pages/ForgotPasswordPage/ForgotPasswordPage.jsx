import React, { useCallback, useState } from 'react'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import * as message from '../../components/Message/Message'
import ImageLogo from '../../assets/images/logo-login.webp'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from '../SignInPage/style'
import { Image } from 'antd'
import { useNavigate } from 'react-router-dom'

const ForgotPasswordPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

    const handleNavigateSignIn = useCallback(() => {
      navigate('/sign-in')
    }, [])

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      message.error('Mật khẩu không khớp')
      return
    }

    // Gọi API đổi mật khẩu ở đây nếu có
    message.success('Đổi mật khẩu thành công')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgb(0, 0, 0, 0.53)', height:'100vh' }}>
      <div style={{width: '800px', height:'445px', borderRadius:'6px', background: '#fff', display: 'flex'}}>
        <WrapperContainerLeft>
          <h2>Đặt lại mật khẩu</h2>
          <p>Nhập mật khẩu mới của bạn</p>

          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                position: 'absolute',
                top: '4px',
                right: '8px',
                zIndex: 10
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="Mật khẩu mới"
              type={isShowPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                position: 'absolute',
                top: '4px',
                right: '8px',
                zIndex: 10
              }}r
            >
              {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="Nhập lại mật khẩu"
              type={isShowConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>

          <ButtonComponent
            disabled={!password || !confirmPassword}
            onClick={handleChangePassword}
            textButton="Xác nhận"
            styleButton={{
              background: 'rgb(255, 57, 69)',
              height: '48px',
              width: '100%',
              border: 'none',
              borderRadius: '4px'
            }}
            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          />

          <p style={{padding: '10px'}}>Nếu bạn đã có tài khoản ? <WrapperTextLight onClick={handleNavigateSignIn}>Đăng nhập</WrapperTextLight></p>
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

export default ForgotPasswordPage
