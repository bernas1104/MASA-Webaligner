import styled, { css } from 'styled-components';

interface InputConfigurationProps {
  flexDirection?: string;
}

interface OptConfigProps {
  isShowing: boolean;
}

export const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1300px;

  margin: 0 auto;
  margin-top: 95px;
  padding: 0 50px;
  padding-bottom: 70px;

  color: #333;

  > p {
    padding-top: 20px;
    font-size: 24px;
    font-weight: 300;
  }
`;

export const Title = styled.h1`
  color: #007715;
  font-size: 64px;
  font-family: 'Roboto Condensed', sans-serif;
`;

export const AlignerContainer = styled.div`
  padding: 50px;
  margin-top: 100px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.25);
`;

export const Form = styled.form`
  display: flex;
  max-width: 100%;
  flex-direction: column;

  small {
    color: #007715;
  }

  > div button {
    margin: 0 auto;
  }
`;

export const InputConfiguration = styled.div<InputConfigurationProps>`
  display: flex;
  align-items: center;
  flex-direction: ${(props) =>
    props.flexDirection ? 'row' : props.flexDirection};

  color: #007715;
  word-wrap: break-word;

  & + & {
    margin-top: 50px;
  }

  .configuration-title {
    display: flex;
    align-items: center;

    width: 100%;

    svg {
      fill: #007715;
      min-width: 25px;
      margin: 5px 20px 5px 0;
    }

    h2 {
      font-size: 36px;
      font-weight: bold;
      font-family: 'Roboto Condensed', sans-serif;
    }
  }

  .input-control {
    width: 100%;
    display: flex;
    justify-content: flex-start;

    div {
      label {
        color: #333;
        font-size: 24px;
      }
    }
  }
`;

export const OptionalConfigurationsTitle = styled.div<OptConfigProps>`
  display: flex;
  flex-direction: column;

  margin-top: 50px;
  padding-left: 45px;

  .optional-configuration-title {
    display: flex;
    align-items: center;

    h2 {
      font-size: 36px;
      font-family: 'Roboto Condensed', sans-serif;
      font-weight: bold;
      color: #007715;
    }

    button {
      border: none;
      background: transparent;
      margin-left: 25px;

      svg {
        transition: transform 0.5s;
        -webkit-transition: transform 0.5s;

        ${(props) =>
          props.isShowing &&
          css`
            transform: rotate(180deg);
          `}
      }
    }
  }
`;

export const OptionalContainer = styled.div<OptConfigProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  overflow: hidden;
  height: auto;
  max-height: 0;
  transition: max-height ease 0.5s;
  -webkit-transition: max-height ease 0.5s;

  > div {
    margin-top: 50px;
  }

  > div + div {
    margin-top: 20px;
  }

  ${(props) =>
    props.isShowing &&
    css`
      max-height: 1000px;
    `}
`;

export const OptionalConfigurationsInput = styled.div<OptConfigProps>`
  display: flex;

  margin-top: 30px;
  padding-left: 45px;
  opacity: 0;
  transition: opacity ease 0.5s;
  -webkit-transition: opacity ease 0.5s;

  .configuration-title {
    display: flex;
    align-items: center;

    width: calc(100% - 85px);

    svg {
      fill: #007715;
      min-width: 25px;
      margin: 5px 20px 5px 0;
    }

    h2 {
      font-size: 24px;
      font-weight: bold;
      font-family: 'Roboto Condensed', sans-serif;
      color: #007715;
    }
  }

  .input-control {
    width: 100%;
    display: flex;
    justify-content: flex-start;

    div {
      label {
        color: #333;
        font-size: 24px;
      }
    }
  }

  ${(props) =>
    props.isShowing &&
    css`
      opacity: 1;
    `}
`;

export const ContactContainer = styled.div`
  margin-top: 50px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const ContactTitle = styled.div`
  display: flex;
  align-items: center;

  color: #007715;
  word-wrap: break-word;

  .configuration-title {
    display: flex;
    align-items: center;

    width: 100%;

    svg {
      fill: #007715;
      min-width: 25px;
      margin: 5px 20px 5px 0;
    }

    h2 {
      font-size: 36px;
      font-weight: bold;
      font-family: 'Roboto Condensed', sans-serif;
    }
  }
`;

export const ContactInput = styled.div`
  display: flex;

  > div {
    flex: 1;
    border-color: #00376f;
    margin-top: 25px;

    input {
      color: #333;
    }

    input::placeholder {
      color: #555;
    }
  }

  > div:first-child {
    margin-right: 25px;
  }

  > div:last-child {
    margin-left: 25px;
  }
`;

export const SequencesContainer = styled.div`
  margin-top: 50px;

  width: 100%;
  display: flex;

  > div:first-child {
    margin-right: 25px;
  }

  > div:last-child {
    margin-left: 25px;
  }
`;

export const SequenceInput = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  h2 {
    color: #007715;
    font-size: 36px;
    font-weight: bold;
    font-family: 'Roboto Condensed', sans-serif;
    margin-bottom: 30px;
  }

  .input-type,
  .edge-title {
    display: flex;
    align-items: center;
    color: #007715;

    h3 {
      font-size: 24px;
    }

    svg {
      margin-right: 25px;
    }
  }

  .radio-type {
    margin-top: 15px;
    padding-left: 2px;
  }

  .sequence-input {
    padding-top: 30px;
    margin-bottom: auto;

    div {
      border-color: #00376f;

      input,
      textarea {
        color: #333;
      }

      input::placeholder,
      textarea::placeholder {
        color: #555;
      }
    }
  }

  .input-edge {
    display: flex;
    align-items: center;
    margin-top: 30px;

    .edge-title {
      margin-right: 30px;
    }
  }
`;
