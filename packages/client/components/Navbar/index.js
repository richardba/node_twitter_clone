import React from 'react';
import Link from 'next/link';
import colors from '../../lib/colors';
import Icon from 'components/Icon';

import NavButton from './NavButton';
import Toolbar from './Toolbar';

const Navbar = ({ currentPage, onNewTweetClick }) => (
  <div className="app-navbar">
    <div className="container">
      <div className="bird">
        <Icon name="bird" color={colors.twitterBlue} size="1.28em" />
      </div>
      <div className="left">
        <Link href="/">
          <NavButton
            text="Home"
            icon="home"
            iconSelected="homeFilled"
            selected={currentPage === 'home'}
          />
        </Link>
        <NavButton
          text="Project on Github"
          icon="promoteMode"
          href="https://github.com/richardba"
          as="a"
        />
      </div>
      <div className="right">
        <Toolbar onNewTweetClick={onNewTweetClick} />
      </div>
    </div>

    <style jsx>{`
      .app-navbar {
        background: #fff;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.45);
        height: 46px;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 999;
      }

      .container {
        position: relative;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .bird {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .bird i {
        color: ${colors.twitterBlue};
        font-size: 1.28em;
      }

      .left {
        height: 100%;
        display: flex;
      }

      .right {
        display: flex;
        align-items: center;
      }

      .right :global(.tweet-btn) {
        margin-left: 16px;
      }
    `}</style>
  </div>
);

export default Navbar;
