import React from 'react'
import { WrapperInputStyle } from './style'

const InputForm = ({ placeholder = 'Nhập text', value, onChange, ...rest }) => {
  const handleOnChangeInput = (e) => {
    if (typeof onChange === 'function') {
      onChange(e.target.value)
    }
  }

  return (
    <WrapperInputStyle
      placeholder={placeholder}
      value={value}
      onChange={handleOnChangeInput}
      {...rest}
    />
  )
}

export default InputForm


// import React from 'react'
// import { WrapperInputStyle } from './style'

// const InputForm = (props) => {

//     const { placeholder = 'Nhập text', ...rests } = props

//     const handleOnChangeInput = (e) => {

//         props.onChange(e.target.value)
        
//     }

//     return (
//         <WrapperInputStyle placeholder={placeholder} value={props.value} {...rests} onChange={handleOnChangeInput}/>
//     )
// }

// export default InputForm