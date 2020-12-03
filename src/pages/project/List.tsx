import React from 'react';
import { Button } from 'antd';
import { history } from 'umi';

export default () => {
  const goInfo = () => {
    history.push('info');
  };
  const hanlderEdit = (id: number) => {
    history.push(`edit/${id}`);
  };
  return (
    <div>
      <Button onClick={goInfo}>详情</Button>
      <Button onClick={() => hanlderEdit(1)}>去新增</Button>
    </div>
  );
};
