import React from 'react';
import { MdMenu, MdClear } from 'react-icons/md';

import {
  NavigationHeader,
  NavigationLinks,
  SideMenu,
  FrozenScreen,
} from './styles';
import './styles.scss';

const Header: React.FC = () => {
  function handleToggleMenu(event: React.MouseEvent): void {
    event.preventDefault();

    const sidemenu = document.querySelector('.sidemenu');

    if (!sidemenu?.classList.contains('show-sidemenu')) {
      const navLinks = document.querySelector('header > ul');

      if (navLinks) {
        const clone = navLinks.cloneNode(true);
        sidemenu?.append(clone);

        document.querySelector('.sidemenu > ul')?.classList.add('db', 'sm-ul');
      }

      sidemenu?.classList.add('show-sidemenu');
      document.querySelector('.frozen-screen')?.classList.add('db');
      document.querySelector('body')?.classList.add('no-scroll');
    } else {
      sidemenu?.classList.remove('show-sidemenu');
      document.querySelector('.frozen-screen')?.classList.remove('db');
      document.querySelector('body')?.classList.remove('no-scroll');
    }
  }

  return (
    <>
      <NavigationHeader>
        <a
          onClick={(event) => handleToggleMenu(event)}
          className="menu-icon"
          href="about:blank"
        >
          <MdMenu size={30} color="#333" />
        </a>

        <a className="logo" href="localhost">
          MASA
          <span className="webaligner">&nbsp;Webaligner</span>
        </a>

        <NavigationLinks>
          <li>
            <a href="l">MASA Project</a>
          </li>
          <li>
            <a href="l">MASA Aligner</a>
          </li>
          <li>
            <a href="l">About</a>
          </li>
          <li>
            <a href="l">Contact</a>
          </li>
          <li>
            <a href="l">Contribute</a>
          </li>
        </NavigationLinks>
      </NavigationHeader>

      <SideMenu className="sidemenu">
        <a onClick={(event) => handleToggleMenu(event)} href="about:blank">
          <MdClear size={30} color="#333" />
        </a>
      </SideMenu>

      <FrozenScreen className="frozen-screen" />
    </>
  );
};

export default Header;
