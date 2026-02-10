import React from 'react';
import styled from 'styled-components';

const InteractiveFeatureCard = ({ feature, COLORS }) => {
  const Icon = feature.icon;
  
  return (
    <StyledWrapper colors={COLORS}>
      <a href={feature.link} className="card-link">
        <div className="card">
          <div className="icon-box">
            <Icon />
          </div>
          <div className="card-content">
            <h3 className="title">{feature.title}</h3>
            <p className="subtitle">{feature.description}</p>
            <div className="learn-more">Learn more →</div>
          </div>
        </div>
      </a>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card-link {
    text-decoration: none;
    color: inherit;
    display: block;
    height: 100%;
  }

  .card {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 32px;
    border-radius: 16px;
    background: linear-gradient(135deg, 
      ${props => props.colors.bg.surface} 0%, 
      ${props => props.colors.bg.secondary} 100%);
    border: 1px solid ${props => props.colors.border.light};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
    min-height: 280px;
  }

  .card-link:hover .card {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }

  .icon-box {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.colors.bg.secondary};
    color: ${props => props.colors.text.primary};
    flex-shrink: 0;
    transition: all 300ms ease-in-out;
  }

  .card-link:hover .icon-box {
    background: ${props => props.colors.border.medium};
    transform: scale(1.1);
  }

  .icon-box svg {
    width: 28px;
    height: 28px;
  }

  .card-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 12px;
  }

  .title {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.colors.text.primary};
    margin: 0;
    padding: 0;
    line-height: 1.3;
  }

  .subtitle {
    font-size: 14px;
    line-height: 1.6;
    color: ${props => props.colors.text.secondary};
    margin: 0;
    padding: 0;
    flex-grow: 1;
  }

  .learn-more {
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.colors.text.primary};
    opacity: 0.8;
    transition: all 200ms ease-in-out;
    display: inline-block;
  }

  .card-link:hover .learn-more {
    opacity: 1;
    transform: translateX(4px);
  }
`;

export default InteractiveFeatureCard;
