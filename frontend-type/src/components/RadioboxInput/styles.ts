import styled, { css } from 'styled-components';

interface RadioboxProps {
  isChecked: boolean;
}

export const Container = styled.div<RadioboxProps>`
  outline: 0;
  display: inline-block;

  margin-right: 20px;

  label {
    cursor: pointer;
    user-select: none;

    width: 100%;
    align-items: center;
    white-space: nowrap;
    display: inline-flex;
    vertical-align: middle;

    .radio-container {
      display: inline-block;
      position: relative;
      box-sizing: border-box;

      width: 20px;
      height: 20px;
      flex-shrink: 0;

      input[type='radio'] {
        position: absolute;
        bottom: 0;
        left: 50%;

        width: 0px;
        height: 0px;
        opacity: 0;
      }

      .radio-hover {
        position: absolute;
        top: calc(50% - 20px);
        left: calc(50% - 20px);

        z-index: 1;
        width: 40px;
        height: 40px;
        pointer-events: none;

        opacity: 0;
        background: white;
        border-radius: 50%;

        transition: opacity ease-in-out 0.2s;
        -webkit-transition: opacity ease-in-out 0.2s;
      }
    }

    .radio-container:hover {
      .radio-hover {
        opacity: 0.05;
      }
    }

    .label-container {
      padding-top: 2px;
      padding-left: 10px;
      display: inline-block;
    }
  }
`;

export const OutterCircle = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #f5f5f5;
`;

export const InnerCircle = styled.div<RadioboxProps>`
  position: absolute;
  top: 0;
  left: 0;

  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f5f5f5;
  transform: scale(0.001);
  transition: transform ease 280ms;

  ${(props) =>
    props.isChecked &&
    css`
      transform: scale(0.5);
    `}
`;
