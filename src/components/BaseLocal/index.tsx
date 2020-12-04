import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

const BaseLocal: React.FC = props => {
  const { children } = props;
  return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>;
};

export default BaseLocal;
