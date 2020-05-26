import styled from 'styled-components';

export const Container = styled.div`
  input[type='file'] {
    display: none;
  }

  button {
    cursor: pointer;

    padding: 4px 32px;
    border: 1px solid #007715;
    border-radius: 5px;
    background: transparent;

    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

    transition: box-shadow 0.2s;
    -webkit-transition: box-shadow 0.2s;

    &:active {
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
        0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }
  }

  span {
    margin-left: 20px;
  }
`;
