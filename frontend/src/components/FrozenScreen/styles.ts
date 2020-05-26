import styled, { css } from 'styled-components';

interface ContainerProps {
  isToggled: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: none;

  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 3;
  width: 100vw;
  height: 100vh;

  background: rgba(0, 0, 0, 0.5);

  ${(props) =>
    props.isToggled &&
    css`
      display: block;
    `}
`;
