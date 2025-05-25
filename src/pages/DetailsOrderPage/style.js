import styled from 'styled-components';

export const WrapperHeaderUser = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 20px;
`;

export const WrapperInfoUser = styled.div`
  flex: 1;
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

export const WrapperContentInfo = styled.div`
  font-size: 15px;
  line-height: 3.0;
  margin-top: 12px;

  .name-info {
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .name-delivery {
    color: orange;
    font-weight: bold;
  }

  .payment-status {
    color: orange;
    font-weight: bold;
  }
`;

export const WrapperLabel = styled.div`
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 8px;
`;

export const WrapperStyleContent = styled.div`
  margin-top: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

export const WrapperProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 500px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const WrapperNameProduct = styled.div`
  font-weight: 500;
  font-size: 16px;
`;

export const WrapperItem = styled.div`
  text-align: center;
  min-width: 100px;
`;

export const WrapperItemLabel = styled.div`
  font-weight: 500;
  font-size: 13px;
  color: #555;
  margin-bottom: 4px;
`;


export const WrapperTotal = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  padding: 0 20px;
  font-size: 20px;

  .total-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    min-width: 500px;
  }

  .label {
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }

  .value {
    font-size: 24px;
    font-weight: 700;
  }

  .subtotal .value {
    color: #000;
  }

  .shipping .value {
    color: #555;
  }

  .total .value {
    color: red;
    font-size: 28px;
  }
`;

