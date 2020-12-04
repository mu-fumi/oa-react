import React from 'react';
import './userlayout.less';
import BaseLocal from '@/components/BaseLocal';

const Layout: React.FC = ({ children }) => (
  <BaseLocal>
    <div id="userLayout" className="user-layout-wrapper">
      <div className="container">{children}</div>
    </div>
  </BaseLocal>
);

export default Layout;
