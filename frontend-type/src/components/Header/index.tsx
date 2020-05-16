import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdMenu, MdClear } from 'react-icons/md';

import { NavigationHeader, NavigationLinks, Sidemenu } from './styles';

import FrozenScreen from '../FrozenScreen';

const Header: React.FC = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggleMenu = useCallback((): void => {
    if (!isToggled) {
      document.querySelector('body')?.setAttribute('style', 'overflow: hidden');

      const sidemenu = document.querySelector('.sidemenu');
      if (sidemenu?.children.length === 1) {
        const navLinks = document.querySelector('header > ul');

        if (navLinks) {
          const clone = navLinks.cloneNode(true);
          sidemenu?.append(clone);
        }
      }
    } else {
      document.querySelector('body')?.removeAttribute('style');
    }

    setIsToggled(!isToggled);
  }, [isToggled]);

  return (
    <>
      <NavigationHeader>
        <button type="button" onClick={handleToggleMenu} className="menu-icon">
          <MdMenu size={30} color="#333" />
        </button>

        <Link className="logo" to="/">
          MASA
          <span className="webaligner">&nbsp;Webaligner</span>
        </Link>

        <NavigationLinks>
          <li>
            <a href="/#masa-project">MASA Project</a>
          </li>
          <li>
            <Link to="/alignments">MASA Aligner</Link>
          </li>
          <li>
            <a href="/#about-us">About</a>
          </li>
          <li>
            <a href="/#contact-us">Contact</a>
          </li>
          <li>
            <a
              href="https://github.com/edanssandes/MASA-Core/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contribute
            </a>
          </li>
        </NavigationLinks>
      </NavigationHeader>

      <Sidemenu
        isToggled={isToggled}
        className="sidemenu"
        onClick={handleToggleMenu}
      >
        <button type="button" onClick={handleToggleMenu}>
          <MdClear size={30} color="#333" />
        </button>
      </Sidemenu>

      <FrozenScreen
        isToggled={isToggled}
        className="frozen-screen"
        onClick={handleToggleMenu}
      />
    </>
  );
};

export default Header;
