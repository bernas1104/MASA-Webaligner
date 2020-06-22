import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  max-width: 50%;
  margin-left: 25px;

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
      z-index: 1;

      pre {
        font-size: 12px;
        display: inline-block;
      }
    }

    .results-summary {
      flex: 1;
      display: flex;
      align-items: flex-start;

      .summary {
        flex: 1;
        padding-top: 20px;

        pre {
          font-size: 14px;
        }
      }

      .adjust {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-left: 25px;

        > div {
          label {
            color: #333;
          }

          input {
            color: #333;
          }

          input::placeholder {
            color: #555;
          }

          border-bottom-color: #333;
        }

        > div + div {
          margin-top: 15px;
        }

        .submit {
          display: flex;
          justify-content: flex-end;
          z-index: 2;

          div + div {
            margin-left: 25px;
          }

          @media screen and (max-width: 400px) {
            flex-direction: column;
            justify-content: flex-start;

            div + div {
              margin-left: 0;
              margin-top: 25px;
            }
          }
        }
      }

      @media screen and (max-width: 768px) {
        width: 100%;
        flex-direction: column !important;

        .summary {
          z-index: 2;
          width: 100%;
          overflow-x: auto;
          font-size: 10px;
        }

        .adjust {
          margin-top: 25px;
          width: 100%;
          padding-left: 0;
        }
      }
    }

    > div button {
      margin-top: 25px;
      width: 100%;
    }
  }

  @media screen and (max-width: 1600px) {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
  }
`;
