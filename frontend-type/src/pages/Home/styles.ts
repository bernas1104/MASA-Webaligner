import styled from 'styled-components';

export const CoverImg = styled.div`
  width: 100vw;
  height: calc(100vh - 75px);

  display: flex;
  align-items: center;
  margin-top: 75px;

  background: #d0d0d0;

  img {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    margin-bottom: 100px;
    align-self: center;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1300px;

  margin: 0 auto;
  margin-top: 70px;
  padding: 0 50px;
  padding-bottom: 70px;

  color: #333;
`;

export const MASAProject = styled.section`
  width: 100%;
  margin-bottom: 100px;

  > h2 {
    color: #007715;
    font-size: 64px;
    text-align: center;
    margin-bottom: 50px;
  }

  > p {
    color: #333;
    font-size: 24px;
    line-height: 1.5em;
    font-weight: 300;
    text-align: center;
    margin-bottom: 50px;
  }
`;

export const CardsContainer = styled.div`
  display: flex;
  justify-content: space-around;

  @media (max-width: 1300px) {
    div + div {
      margin-left: 20px;
    }
  }

  @media (max-width: 1000px) {
    div + div {
      margin-left: 0;
      margin-top: 50px;
    }

    flex-direction: column;
    align-items: center;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 350px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.25);

  color: #333;
  background: #f5f5f5;

  padding: 0 50px;
  text-align: center;

  * {
    margin-top: 50px;
  }

  *:last-child {
    margin-bottom: 50px;
  }

  img {
    border-radius: 50%;
  }

  h3 {
    font-size: 36px;
    color: #007715;
  }
`;

export const AboutUs = styled.section`
  margin-bottom: 100px;

  h2 {
    color: #007715;
    font-size: 64px;
    text-align: center;
    margin-bottom: 50px;
  }
`;

export const AboutUsContainer = styled.div`
  display: flex;
  align-items: center;

  color: #333;

  @media (max-width: 1200px) {
    flex-direction: column;
    justify-content: center;

    img {
      order: -1;
      margin-left: 0 !important;
    }

    p {
      margin-top: 50px;
      text-align: center;
    }
  }

  p {
    flex: 1;
    font-size: 18px;
    line-height: 1.5em;
    margin-right: 25px;
  }

  img {
    flex: 1;
    width: 100%;
    max-width: 100%;
    margin-left: 25px;
  }
`;

export const Footer = styled.footer`
  width: 100%;
  max-width: 100vw;
`;

export const ContactUs = styled.section`
  h2 {
    color: #007715;
    font-size: 64px;
    text-align: center;
    margin-bottom: 50px;
  }
`;

export const ContactContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f5f5f5;

  width: 100%;
  background: #00376f;

  padding: 50px 20px;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  width: 100%;

  @media (max-width: 650px) {
    flex-direction: column;

    p,
    pre,
    a {
      font-size: 14px !important;
    }
  }

  a {
    color: #f5f5f5;
    text-decoration: none;
    transition: opacity 0.2s;
    -webkit-transition: opacity 0.2s;
  }

  a:hover {
    opacity: 0.75;
  }

  > div + div {
    margin: 0 25px;
  }

  > div {
    flex: 1;

    div {
      h3 {
        opacity: 0.5;
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 20px;
      }

      div {
        display: flex;
        align-items: center;

        *:first-child {
          margin-right: 20px;
        }
      }

      .address {
        align-items: flex-start;

        pre {
          font-family: inherit;
          font-size: 18px;
        }
      }

      ul {
        list-style: none;

        li {
          margin-bottom: 20px;

          *:first-child {
            margin-right: 20px;
          }

          a {
            display: flex;
            align-items: center;
          }
        }
      }
    }

    div + div {
      margin-top: 50px;
    }
  }

  @media (max-width: 1000px) {
    div + div {
      margin-right: 0;
    }
  }

  @media (max-width: 650px) {
    flex-direction: column;

    div + div {
      margin-top: 50px;
      margin-left: 0;
    }
  }
`;

export const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  margin-left: 25px;

  > * + * {
    margin-top: 20px;
  }

  @media (max-width: 1000px) {
    margin-top: 100px;
    margin-right: 25px;
    padding-left: 0;
  }
`;

export const Divider = styled.div`
  width: 0;
  height: 200px;
  border: 1px solid #f5f5f5;

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const FooterContainer = styled.div`
  width: 100%;
  background: #00376f;
  padding: 100px 20px 20px 20px;

  color: #f5f5f5;
  font-weight: 700;
  text-align: center;

  a {
    color: #f5f5f5;
    text-decoration: none;
    transition: color 0.2s;
    -webkit-transition: color 0.2s;
  }

  a:hover {
    color: #29a83f;
  }
`;
