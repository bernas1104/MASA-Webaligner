import styled, { css } from 'styled-components';

interface ContainerProps {
  render: number;
}

interface SidemenuProps {
  isToggled: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  max-width: 1440vw;
  margin: 175px auto 0 auto;

  padding: 0 50px;
  padding-bottom: 70px;

  color: #333;

  display: flex;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.render === 2 &&
    css`
      @media screen and (max-width: 1600px) {
        flex-direction: column;
      }
    `}

  ${(props) =>
    props.render === 1 &&
    css`
      flex-direction: column;

      h2 {
        font-size: 36px;
        text-align: center;
        margin-bottom: 50px;
      }

      .cards {
        .m-r25 {
          margin-right: 25px;
        }

        .m-l25 {
          margin-left: 25px;
        }

        width: 100%;
        display: flex;
        justify-content: center;

        @media screen and (max-width: 960px) {
          flex-direction: column !important;

          .m-l25,
          .m-r25 {
            margin: 0;
          }

          > div + div {
            margin-top: 50px !important;
          }
        }
      }
    `}

    @media screen and (max-width: 768px) {
    padding: 15px;
  }
`;

export const GraphContainer = styled.div`
  flex: 1;
  max-width: 50%;
  margin-right: 25px;

  > div {
    width: 100% !important;
    height: 700px !important;
    max-height: 700px !important;

    div {
      width: 100% !important;
      height: 100% !important;
      max-height: 700px !important;
    }
  }

  @media screen and (max-width: 1600px) {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    margin-bottom: 50px;
  }
`;

export const Sidemenu = styled.div<SidemenuProps>`
  display: flex;
  position: fixed;

  z-index: 99;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  max-width: 500px;

  background: #f5f5f5;
  border-right: 1px solid #333;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);

  transition: all 0.2s;
  -webkit-transition: all 0.2s;

  ${(props) =>
    !props.isToggled &&
    css`
      left: -500px;
      box-shadow: 0;
    `}

  .sidemenu-container {
    flex: 1;
    width: 100%;

    padding: 50px 20px;
    overflow: auto;

    h3 {
      color: #007715;
    }

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
    border-top: 0;
    border-left: 1px solid #333;
    border-right: 1px solid #333;
    border-bottom: 1px solid #333;

    width: 100%;
    height: 100%;
    max-width: 200px;
    max-height: 40px;
    top: 45%;
    left: 420px;
    background: #f5f5f5;

    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

    transition: all 0.2s;
    -webkit-transition: all 0.2s;

    ${(props) =>
      !props.isToggled &&
      css`
        left: -80px;
      `}

    &:active {
      border-top: 0;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
        0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    svg {
      transform: rotate(180deg);
      transition: rotate 0.2s;
      -webkit-transition: rotate 0.2s;
    }
  }

  @media screen and (max-width: 600px) {
    width: 100%;
    max-width: 300px;

    ${(props) =>
      !props.isToggled &&
      css`
        left: -300px;
        box-shadow: 0;
      `}

    button {
      left: 220px;

      transition: all 0.2s;
      -webkit-transition: all 0.2s;

      ${(props) =>
        !props.isToggled &&
        css`
          left: -80px;
        `}
    }
  }
`;

export const ResultsCard = styled.div`
  flex: 1;
  height: 500px;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);

  background: #f5f5f5;
  overflow: auto;
  padding: 50px;

  h3 {
    color: #007715;
    font-size: 28px;
    text-align: center;
    font-family: 'Roboto Condensed', sans-serif;
  }

  hr {
    height: 3px;
    background: #333;
  }

  pre {
    font-family: 'Roboto Mono', sans-serif;
  }

  * + * {
    margin-top: 30px;
  }
`;

export const ErrorContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  height: calc(100vh - 78px);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 78px auto 0 auto;

  text-align: center;

  h1 {
    font-size: 100px;
    color: #00376f;

    span {
      color: #007715;
    }

    margin-bottom: 50px;
  }

  p {
    font-size: 24px;
    color: #007715;

    & + p {
      margin-top: 10px;
    }
  }
`;
