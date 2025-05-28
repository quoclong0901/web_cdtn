import React from 'react';
import styled from 'styled-components';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaYoutube, FaInstagram, FaTiktok, FaFacebookMessenger } from 'react-icons/fa';

const FooterContainer = styled.footer`
  width: 1230px;
  margin: 0 auto;
  background-color: #002366;
  color: #fff;
  font-family: Arial, sans-serif;
  padding: 32px 16px;
`;

const TopSupport = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 24px;

  div {
    width: 24%;
    min-width: 260px;
    margin-bottom: 12px;
  }

  span {
    display: block;
    font-weight: bold;
    color: #ff0000;
    margin-bottom: 4px;
  }

  p {
    margin: 2px 0;
    font-size: 14px;
  }
`;

const SubscribeSection = styled.div`
  background: linear-gradient(90deg, #002366, #0033cc);
  padding: 16px;
  margin-bottom: 24px;
  text-align: center;
  color: #fff;

  input {
    padding: 8px;
    width: 280px;
    margin-right: 8px;
    border: none;
    border-radius: 4px;
  }

  button {
    background-color: #d70018;
    border: none;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  font-size: 14px;

  h4 {
    color: #ff0000;
    margin-bottom: 8px;
  }

  ul {
    list-style: none;
    padding: 0;
    color: #ddd;
  }

  li {
    margin: 6px 0;
  }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  flex-wrap: wrap;
  color: #ccc;
  font-size: 13px;

  .social-icons {
    display: flex;
    gap: 10px;
    font-size: 20px;

    svg {
      color: white;
      cursor: pointer;
      transition: transform 0.2s;
    }

    svg:hover {
      transform: scale(1.1);
      color: #d70018;
    }
  }
`;

const FooterComponent = () => {
  return (
    <FooterContainer>
      <TopSupport>
        <div>
          <span><FaPhoneAlt /> Bán hàng trực tuyến:</span>
          <p>1900 2164 - Nhánh 1 (8h - 21h)</p>
          <p>0974 55 88 11</p>
        </div>
        <div>
          <span><FaPhoneAlt /> Bán dự án / doanh nghiệp:</span>
          <p>1900 2164 - Nhánh 2</p>
          <p>038 658 6699</p>
        </div>
        <div>
          <span><FaPhoneAlt /> Tư vấn trả góp:</span>
          <p>1900 2164 - Nhánh 3</p>
          <p>0946 01 66 33</p>
        </div>
        <div>
          <span><FaPhoneAlt /> Hỗ trợ kỹ thuật:</span>
          <p>1900 2165</p>
        </div>
      </TopSupport>

      <SubscribeSection>
        <h3>Nhận thông báo khuyến mại miễn phí từ N16 - HieuLonH</h3>
        <input placeholder="Nhập địa chỉ email của bạn" />
        <button onClick="https://www.facebook.com/quoclong0802">GỬI NGAY</button>
      </SubscribeSection>

      <InfoGrid>
        <div>
          <h4>Thông tin công ty</h4>
          <ul>
            <li>Giới thiệu</li>
            <li>Tuyển dụng</li>
            <li>Liên hệ</li>
            <li>Bảo mật thông tin</li>
          </ul>
        </div>
        <div>
          <h4>Quy định & Chính sách</h4>
          <ul>
            <li>Chính sách đổi trả</li>
            <li>Bảo hành</li>
            <li>Vận chuyển</li>
            <li>Khách hàng doanh nghiệp</li>
          </ul>
        </div>
        <div>
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li>Hướng dẫn mua hàng</li>
            <li>Hướng dẫn trả góp</li>
            <li>Phương thức thanh toán</li>
            <li>Góp ý / Khiếu nại</li>
          </ul>
        </div>
        <div>
          <h4>Liên hệ</h4>
          <ul>
            <li><FaMapMarkerAlt /> 89 Lê Duẩn, Hà Nội</li>
            <li><FaPhoneAlt /> 1900 2164</li>
            <li><FaEnvelope /> banhangonline@hieulonh.com.vn</li>
          </ul>
        </div>
      </InfoGrid>

      <BottomBar>
        <div>&copy; 2025 HieuLonH - All rights reserved.</div>
        <div className="social-icons">
          <FaFacebook />
          <FaYoutube />
          <FaInstagram />
          <FaTiktok />
          <FaFacebookMessenger />
        </div>
      </BottomBar>
    </FooterContainer>
  );
};

export default FooterComponent;
