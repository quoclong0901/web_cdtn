import React from 'react';
import leftBanner from '../../assets/images/left.webp';
import rightBanner from '../../assets/images/right.webp';

const SliderComponentY = () => {
  return (
    <>
      <div className="fixed-image left">
        <img src={leftBanner} alt="Left Banner" />
      </div>

      <div className="fixed-image right">
        <img src={rightBanner} alt="Right Banner" />
      </div>

      <style jsx="true">{`
        .fixed-image {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          width: 100px;
          height: 380px;
          z-index: 1000;
        }

        .fixed-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fixed-image.left {
          left: 0; /* Sát mép trái màn hình */
        }

        .fixed-image.right {
          right: 0; /* Sát mép phải màn hình */
        }
      `}</style>
    </>
  );
};

export default SliderComponentY;
