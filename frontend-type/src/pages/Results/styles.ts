import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1440vw;
  margin: 175px auto 0 auto;

  padding: 0 50px;
  padding-bottom: 70px;

  color: #333;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const GraphContainer = styled.div`
  flex: 1;
  max-width: 50%;

  > div {
    width: 100%;
    height: 700px !important;
    max-height: 700px !important;

    div {
      width: 100%;
      height: 100% !important;
      max-height: 700px !important;
    }
  }
`;

export const TextContainer = styled.div`
  flex: 1;
  max-width: 50%;

  .results-card {
    display: flex;
    flex-direction: column;

    padding: 50px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);

    height: 700px;

    .results-text {
      margin-bottom: 50px;

      height: auto;
      max-height: 400px;
      overflow-y: auto;

      pre {
        font-size: 12px;
      }
    }

    .results-summary {
      flex: 1;
      overflow-x: auto;
    }
  }
`;

export const Sidemenu = styled.div`
  display: flex;
  position: fixed;

  left: 0;
  top: 78px;
  width: 100%;
  max-width: 500px;
  height: calc(100vh - 78px);

  background: pink;

  .sidemenu-container {
    flex: 1;
    width: 100%;

    padding: 50px 20px;
    overflow: auto;

    pre {
      font-size: 14px;
    }
  }

  button {
    cursor: pointer;

    font-weight: 500;
    font-family: 'Roboto', sans-serif;

    display: flex;
    position: fixed;
    align-items: center;
    transform: rotate(-90deg);
    justify-content: space-between;

    padding: 8px 16px;
    border-radius: 0 0 5px 5px;
    border-left: 1px solid #333;
    border-right: 1px solid #333;
    border-bottom: 1px solid #333;

    width: 100%;
    height: 100%;
    max-width: 200px;
    max-height: 40px;
    top: 50%;
    left: 420px;

    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

    transition: box-shadow 0.2s;
    -webkit-transition: box-shadow 0.2s;

    &:active {
      border-top: 0;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
        0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }
  }

  @media screen and (max-width: 600px) {
    width: 100%;
    max-width: 300px;

    button {
      left: 220px;
    }
  }
`;
