import React from 'react';
import styled from 'styled-components';
import { Star } from 'lucide-react';

const Testimonial3DCard = ({ testimonial, COLORS, SHADOWS }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <div key={`full-${i}`} className="star-container">
          <Star className="star-icon" size={14} />
        </div>
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="star-container half-star">
          <Star className="star-icon" size={14} />
        </div>
      );
    }
    
    return stars;
  };
  
  return (
    <StyledWrapper colors={COLORS} shadows={SHADOWS}>
      <div className="parent">
        <div className="card">
          <div className="content-box">
            <span className="card-title">{testimonial.name}</span>
            <p className="card-content">
              "{testimonial.content}"
            </p>
            <div className="rating-box">
              {renderStars(testimonial.rating)}
            </div>
          </div>
          <div className="date-box">
            <img src={testimonial.avatar} alt={testimonial.name} className="avatar-image" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .parent {
    width: 100%;
    max-width: 280px;
    padding: 20px;
    perspective: 1000px;
  }

  .card {
    padding-top: 50px;
    border: 2px solid ${props => props.colors.text.primary};
    transform-style: preserve-3d;
    background: linear-gradient(135deg, #0000 18.75%, ${props => props.colors.bg.secondary} 0 31.25%, #0000 0),
      repeating-linear-gradient(45deg, ${props => props.colors.bg.secondary} -6.25% 6.25%, ${props => props.colors.text.primary} 0 18.75%);
    background-size: 60px 60px;
    background-position: 0 0, 0 0;
    background-color: ${props => props.colors.text.primary};
    width: 100%;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 17px 10px -10px;
    transition: all 0.5s ease-in-out;
    position: relative;
  }

  .card:hover {
    background-position: -100px 100px, -100px 100px;
    transform: rotate3d(0.5, 1, 0, 30deg);
  }

  .content-box {
    background: ${props => props.colors.bg.surface};
    border-top: 2px solid ${props => props.colors.text.primary};
    transition: all 0.5s ease-in-out;
    padding: 60px 25px 25px 25px;
    transform-style: preserve-3d;
  }

  .content-box .card-title {
    display: inline-block;
    color: ${props => props.colors.text.primary};
    font-size: 18px;
    font-weight: 900;
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 50px);
  }

  .content-box .card-title:hover {
    transform: translate3d(0px, 0px, 60px);
  }

  .content-box .card-content {
    margin-top: 12px;
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.colors.text.secondary};
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 30px);
    line-height: 1.5;
  }

  .content-box .card-content:hover {
    transform: translate3d(0px, 0px, 60px);
  }

  .rating-box {
    margin-top: 12px;
    display: flex;
    gap: 4px;
    transform: translate3d(0px, 0px, 20px);
    transition: all 0.5s ease-in-out;
  }

  .rating-box:hover {
    transform: translate3d(0px, 0px, 60px);
  }

  .star-container {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .star-container.half-star .star-icon {
    clip-path: inset(0 50% 0 0);
  }

  .star-icon {
    color: ${props => props.colors.accent.warning};
    fill: ${props => props.colors.accent.warning};
    stroke-width: 0.5;
  }

  .date-box {
    position: absolute;
    top: 30px;
    right: 30px;
    height: 60px;
    width: 60px;
    background: ${props => props.colors.border.medium};
    border: 2px solid ${props => props.colors.text.primary};
    padding: 0;
    transform: translate3d(0px, 0px, 80px);
    box-shadow: rgba(100, 100, 111, 0.2) 0px 17px 10px -10px;
    overflow: hidden;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export default Testimonial3DCard;
