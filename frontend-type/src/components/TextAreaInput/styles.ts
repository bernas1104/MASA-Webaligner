import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
}

export const Container = styled.div<ContainerProps>`
  border-bottom: 2px solid #f5f5f5;
  position: relative;

  padding: 8px 0;

  display: flex;
  align-items: flex-start;
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

    transition: transform 0.2;
    -webkit-transition: transform 0.2s;
  }

  &:focus-within::after {
    transform: scaleX(1);
  }

  textarea {
    flex: 1;
    border: none;
    padding: 8px 0;

    font-size: 16px;
    resize: none;
    color: #f5f5f5;
    background: transparent;
    z-index: 2;

    transition: opacity 0.2s;
    -webkit-transition: opacity 0.2s;
  }

  label {
    position: absolute;
    left: 0;
    top: 16px;
    display: inline-block;

    transition: all 0.2s;
  }

  ${(props) =>
    (props.isFocused || props.isFilled) &&
    css`
      label {
        top: -8px !important;
        font-size: 12px;
      }

      svg {
        fill: #29a83f;
      }
    `}
`;
