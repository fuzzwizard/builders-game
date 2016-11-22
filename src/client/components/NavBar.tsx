import * as React from 'react';
import {Link} from 'react-router';
import Login from './Login';
import Logout from './Logout';
import {logIn, logOut} from '../utils/socket_io';
import UserBadgeContainer from '../containers/UserBadgeContainer';

export default({isAuth}) => (

  <nav className='nav'>
    <div className='navContent'>
      <h1 className='navTitle'>BUILDERS</h1>
      <Link className='navLink' activeClassName='active' to='/'>Home</Link>
      <Link className='navLink' activeClassName='active' to='/profile'>Profile</Link>
      <Link className='navLink' activeClassName='active' to='/dashboard'>Dashboard</Link>
      <UserBadgeContainer />
      {isAuth ? <Login logIn ={logIn} /> : <Logout logOut={logOut} />}
    </div>

    <a href="https://github.com/Hrr-19-crushers/builders-game"><img
      className="github"
      src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
      alt="Fork me on GitHub"
      data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"/>
    </a>
  </nav>
);
