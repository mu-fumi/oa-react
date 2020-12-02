import React from 'react';
import { Button, DatePicker, ConfigProvider, message } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
  LoadingOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';

import Line from './Line';

console.log('11 -> :', 11);

export default () => {
  const success = () => {
    message.success('This is a success message');
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div>
        <br />
        <Button type="text" onClick={success}>
          Text Button
        </Button>

        <StepForwardOutlined />
        <HomeOutlined />
        <SettingFilled />
        <SmileOutlined />
        <SyncOutlined spin />
        <SmileOutlined rotate={180} />
        <LoadingOutlined />

        <Button type="link">Link Button</Button>
        <DatePicker></DatePicker>
        <Line></Line>
      </div>
    </ConfigProvider>
  );
};
