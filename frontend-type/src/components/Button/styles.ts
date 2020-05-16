import styled, { css } from 'styled-components';

interface ContainerProps {
  marginTop: number;
  align?: string;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: flex-end;

  ${(props) =>
    props.align &&
    css`
      justify-content: ${props.align};
    `}

  button {
    cursor: pointer;

    padding: 8px 32px !important;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;

    border: none;
    border-radius: 4px;
    color: #00376f;
    background-color: #f5f5f5;

    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

    transition: box-shadow 0.2s;
    -webkit-transition: box-shadow 0.2s;
  }

  button:active {
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
      0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  }

  button::-moz-focus-inner {
    border: 0;
  }

  ${(props) =>
    props.marginTop &&
    css`
      margin-top: ${props.marginTop}px;
    `}
`;
