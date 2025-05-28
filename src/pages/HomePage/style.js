import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import styled, { keyframes } from 'styled-components';

// Tạo animation gradient chuyển màu
const gradientAnimation = keyframes`
  0% {
    background: linear-gradient(90deg, red, blue);
  }
  50% {
    background: linear-gradient(90deg, blue, red);
  }
  100% {
    background: linear-gradient(90deg, red, blue);
  }
`;

// Styled component có animation
export const ColorBox = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 24px;
  animation: ${gradientAnimation} 3s infinite linear;
  background-size: 200% 200%;
  color: white;
`;

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 10px 0px 10px 0px;
    height: 44px;
    font-weight: bold;
`

export const WrapperButtonMore = styled(ButtonComponent)`
    background-color: #fff;

    &:hover {
        color: #fff;
        background: rgb(13, 92, 182);

        span {
            color: #fff;
        }
    }

    width: 100%;
    text-align: center;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'} 
`

export const WrapperProducts = styled.div`
    display: flex;
    gap: 14px;
    marginTop: 20px;
    flex-wrap: wrap;
    padding-top: 15px;
`


export const InfoBar = styled.div`
  background-color: #007BFF; /* màu xanh */
  color:rgb(243, 230, 157); /* màu vàng */
  padding: 10px 20px;
  text-align: center;
  font-size: 16px;
  display: flex;
  justify-content: space-around;
  gap: 12px;
  flex-wrap: wrap;
  cursor: pointer;
`;

export const InfoItem = styled.span`
  font-weight: bold;
  &::after {
    margin: 0 8px;
  }
`;