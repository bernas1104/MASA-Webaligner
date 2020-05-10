import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
}

export const Container = styled.div<ContainerProps>`
  position: relative;
  border-bottom: 2px solid #f5f5f5;

  padding-bottom: 5px;

  width: 100%;
  display: flex;
  align-items: center;
  transition: border-color 0.2s;
  -webkit-transition: border-color 0.2s;

  &::after {
    content: '';

    display: block;
    position: absolute;

    width: 100%;
    bottom: -2px;
    border-bottom: 2px solid #29a83f;
    transform: scaleX(0);

    transition: transform 0.2s;
    -webkit-transition: transform 0.2s;
  }

  &:focus-within::after {
    transform: scaleX(1);
  }

  select {
    width: 100%;
    border: none;
    font-size: 16px;

    color: #333;
    background: transparent;

    appearance: none;
    -webkit-appearance: none;

    &:focus {
      outline: none;
    }
  }

  label {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    z-index: -1;
    color: #a5a5a5;

    transition: all 0.2s;
  }

  svg {
    position: absolute;
    right: 0;
    z-index: -1;
  }

  ${(props) =>
    (props.isFocused || props.isFilled) &&
    css`
      label {
        top: -15px !important;
        font-size: 12px;
      }

      svg {
        fill: #29a83f;
      }
    `}
`;
