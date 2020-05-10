import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
}

export const Container = styled.div<ContainerProps>`
  position: relative;
  border-bottom: 2px solid #f5f5f5;

  padding-top: 20px;

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

    color: #333;
    background: transparent;

    appearance: none;
    -webkit-appearance: none;

    &:focus {
      outline: none;
    }

    option:invalid,
    option[value=''],
    option:first-child {
      color: pink;
    }
  }

  label {
    position: absolute;
    left: 0;
    top: 28px;
    display: inline-block;

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
        top: 10px !important;
        font-size: 12px;
      }

      svg {
        fill: #29a83f;
      }
    `}
`;
