import React from 'react';
import { Button } from 'antd';
import { history } from 'umi';

export default () => {
  const goInfo = () => {
    history.push('info');
  };
  const hanlderAdd = () => {
    history.push('add');
  };
  return (
    <div>
      <Button onClick={goInfo}>详情</Button>
      <Button onClick={() => hanlderAdd()}>去新增</Button>
    </div>
  );
};
