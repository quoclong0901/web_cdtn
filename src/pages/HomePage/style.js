import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    justify-content: flex-start;
    padding: 10px 0px 10px 0px;
    height: 44px;
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