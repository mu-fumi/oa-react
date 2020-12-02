import React from 'react';
import './userlayout.less'

const Layout: React.FC = ({ children }) => (
  <div id="userLayout" className="user-layout-wrapper">
    <div className="container">{children}</div>
  </div>
);

export default Layout;
