import { SearchOutlined } from '@ant-design/icons'
import React from 'react'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
    // muốn dùng lại nhiều chỗ thì chỉ cần nhập các keys
    const {size , placeholder,
        textButton ,
        backgroundColorInput = '#fff', 
        backgroundColorButton ='rgb(13, 92, 182)',
        colorButton = '#fff',
        borderRadius = '0px',
        variant = 'bordered',
    } = props

  return (
    <div style={{display: 'flex'}}>
        <InputComponent 
            size={size} 
            placeholder={placeholder}  
            variant={variant}
            style={
                {
                    borderRadius: borderRadius, 
                    backgroundColor: backgroundColorInput,
                    border: '1px solid #ccc',
                }
            }
            { ...props }
        />

        <ButtonComponent
            size={size} 
            icon={<SearchOutlined style={{color: colorButton}}/>} 
            styleButton={
                {   
                    borderRadius: borderRadius, 
                    background: backgroundColorButton,
                    border: 'none',
                }
            }
            textButton={textButton}
            styleTextButton={{color: colorButton}}
        />
    </div>
  )
}

export default ButtonInputSearch
