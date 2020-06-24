import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  span {
    background: #00376f;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    width: 160px;
    color: #fff;
    opacity: 0;
    transition: all 0.4s;
    visibility: hidden;
    text-align: center;

    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);

    &::before {
      border-style: solid;
      border-color: #00376f transparent;
      border-width: 6px 6px 0 6px;
      bottom: 20px;
      top: 100%;
      position: absolute;
      left: 43.5%;
      transform: translateX(-50%);
      content: '';
    }
  }

  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`;
