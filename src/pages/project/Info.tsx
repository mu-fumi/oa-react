import React from 'react';
import { Button } from 'antd';
import { history } from 'umi';

export default () => {
  const hanlderAdd = () => {
    history.push('add');
  };
  const hanlderEdit = (id: number) => {
    history.push(`edit/${id}`);
  };
  return (
    <div>
      <Button onClick={hanlderAdd}>去新增</Button>
      <Button onClick={() => hanlderEdit(1)}>去编辑</Button>
    </div>
  );
};
