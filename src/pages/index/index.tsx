import React from 'react';
import styles from './index.less';
import { Button } from 'antd';

export default () => {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>

      <Button type="primary">Primary Button</Button>
      <Button>Default Button</Button>
      <Button type="dashed">Dashed Button</Button>
      <br />
      <Button type="text">Text Button</Button>
      <Button type="link">Link Button</Button>
    </div>
  );
};
