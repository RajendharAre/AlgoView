import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="spinner">
        <div />   
        <div />    
        <div />    
        <div />    
        <div />    
        <div />    
        <div />    
        <div />    
        <div />    
        <div />    
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb);

  .spinner {
    position: relative;
    width: 50px;
    height: 50px;
  }

  .spinner div {
    position: absolute;
    width: 6px;
    height: 15px;
    background: linear-gradient(135deg, #c3e6ec, #a7d1d9);
    left: 22px;
    top: 8px;
    border-radius: 3px;
    animation: spinner-rotate 1.2s linear infinite;
    transform-origin: 3px 27px;
  }

  .spinner div:nth-child(1) {
    animation-delay: 0s;
  }

  .spinner div:nth-child(2) {
    animation-delay: -0.11s;
  }

  .spinner div:nth-child(3) {
    animation-delay: -0.22s;
  }

  .spinner div:nth-child(4) {
    animation-delay: -0.33s;
  }

  .spinner div:nth-child(5) {
    animation-delay: -0.44s;
  }

  .spinner div:nth-child(6) {
    animation-delay: -0.55s;
  }

  .spinner div:nth-child(7) {
    animation-delay: -0.66s;
  }

  .spinner div:nth-child(8) {
    animation-delay: -0.77s;
  }

  .spinner div:nth-child(9) {
    animation-delay: -0.88s;
  }

  .spinner div:nth-child(10) {
    animation-delay: -0.99s;
  }

  @keyframes spinner-rotate {
    0% {
      transform: rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: rotate(360deg);
      opacity: 1;
    }
  }
`;

export default Loader;
