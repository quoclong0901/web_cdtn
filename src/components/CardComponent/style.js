import styled from 'styled-components'
import { Card } from 'antd'

export const WrapperCardStyle = styled(Card)`
  width: 242px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

export const WrapperImageBox = styled.div`
  width: 100%;
  height: 180px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  & > img:first-child {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .logo {
    position: absolute;
    top: 0;
    left: 0;
    width: 68px;
    height: 14px;
    border-top-left-radius: 3px;
  }
`

export const WrapperCardContent = styled.div`
  padding: 10px;
`

export const StyleNameProduct = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #333;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 8px;
`

export const WrapperReportText = styled.div`
  font-size: 12px;
  color: rgb(56, 56, 61);
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`

export const WrapperPriceText = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: rgb(255, 66, 78);
  display: flex;
  align-items: center;
`

export const WrapperDiscountText = styled.span`
  font-weight: 500;
  font-size: 12px;
  color: rgb(255, 66, 78);
`

export const WrapperStyleTextSell = styled.span`
  font-size: 13px;
  color: rgb(120, 120, 120);
`
