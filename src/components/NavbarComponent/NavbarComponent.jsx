import React from 'react'
import { WrapperContent, WrapperLabelText, WrapperTextPrice, WrapperTextValue } from './style'
import { Checkbox, Rate } from 'antd'

const NavbarComponent = () => {
    const onChange = () => { }

    const renderContent= (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return (
                        <WrapperTextValue>{option}</WrapperTextValue>
                    ) 
                })

            case 'checkbox':
                return (
                    <Checkbox.Group style={{width:'100%', display: 'flex', gap: '12px', flexDirection: 'column'}} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <Checkbox style={{marginLeft: '0px'}} value='option.value'>{option.label}</Checkbox>
                            )
                        })}

                    </Checkbox.Group>
                )

            case 'star':
                return options.map((option) => {
                    return (
                    <div style={{display: 'flex', gap:'4px'}}>
                        <Rate style={{fontSize: '12px'}} disabled defaultValue={option}/>
                        <span>{` Từ ${option} sao `}</span>
                    </div> 
                    )
                })

            case 'price':
                return options.map((option) => {
                    return (
                    <WrapperTextPrice>{option}</WrapperTextPrice> 
                    )
                })

            default:
                return {}
        }
    }

    
  return (
    <div >
        {/* <WrapperLabelText>Label</WrapperLabelText> */}

        {/* <WrapperContent>
            {renderContent('text', ['Tu lanh', 'TV', 'MAYGIAT'])}
        </WrapperContent> */}
        
        {/* <WrapperContent>
            {renderContent('checkbox', [
                {value: 'a', label: 'A' },
                {value: 'b', label: 'B' },
            ])}
        </WrapperContent>

        <WrapperContent>
            {renderContent('star', [3, 4, 5])}
        </WrapperContent>

        <WrapperContent>
            {renderContent('price', ['duoi 40', 'tren 40'])}
        </WrapperContent> */}
    </div>

  )
}

export default NavbarComponent;
