import styled, { css } from 'styled-components';

interface SidemenuProps {
  isToggled: boolean;
}

export const NavigationHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;

  width: 100%;
  max-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  font-size: 24px;

  background: #f5f5f5;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.25);

  .menu-icon {
    display: none;
    padding-bottom: 5px;
    cursor: pointer;
  }

  .f1 {
    flex: 1;
    color: #000;
  }

  .logo {
    font-weight: bold;
    font-family: 'Anton', sans-serif;

    display: flex;
    justify-content: flex-start;

    font-size: 36px;
    text-align: center;
    text-decoration: none;

    color: #00376f;
    transition: opacity 0.2s;
    -webkit-transition: opacity 0.2s;

    padding-bottom: 5px;

    span {
      color: #007715;
    }
  }

  .logo:hover,
  li a:hover {
    opacity: 0.8;
  }

  @media screen and (max-width: 1100px) {
    justify-content: flex-start;

    .logo {
      padding: 0;
    }

    .menu-icon {
      display: block;

      border: none;
      padding: 0;
      margin-right: 50px;
      background: #f5f5f5;
    }

    .menu-icon::-moz-focus-inner {
      border: 0;
    }
  }

  @media screen and (max-width: 1100px) {
    .menu-icon {
      margin-right: 20px;
    }
  }
`;

export const NavigationLinks = styled.ul`
  flex: 1;

  width: 100%;
  display: flex;
  list-style: none;
  justify-content: flex-end;
  font-weight: 300;

  margin-left: 50px;
  margin-right: 20px;

  li {
    margin-left: 30px;

    a {
      color: #007715;
      text-decoration: none;
    }
  }

  li:after {
    content: '';
    display: block;
    border-bottom: 2px solid black;
    width: 0;
    height: 5px;
    right: 0;
    transition: 0.5s ease;
    -webkit-transition: 0.5s ease;
  }

  li:hover:after {
    width: 100%;
  }

  @media screen and (max-width: 1100px) {
    display: none;
  }
`;

export const Sidemenu = styled.div<SidemenuProps>`
  position: fixed;
  top: 0;
  left: -400px;
  z-index: 99;

  width: 300px;
  height: 100vh;
  background: #f5f5f5;
  box-shadow: 5px 0 10px rgba(0, 0, 0, 0.25);

  padding: 20px;
  display: flex;
  flex-direction: column;

  button {
    align-self: flex-end;
    margin-bottom: 20px;
    border: none;
    background: #f5f5f5;
    cursor: pointer;
  }

  button::-moz-focus-inner {
    border: 0;
  }

  transition: left ease-in-out 0.5s;

  ${(props) =>
    props.isToggled &&
    css`
      left: 0;

      ul {
        display: block;
        margin: 0;

        li + li {
          margin-top: 20px;
        }
      }
    `}
`;
