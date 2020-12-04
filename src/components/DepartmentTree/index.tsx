import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';
import './index.less';
import request from '@/utils/request';
import { menusNest } from '@/utils/utils';

export default function index({ menuSelect }) {
  const [treeData, setTreeData] = useState([]);
  const [reqData, setreqData] = useState([]);
  const [firstArr, setfirstArr] = useState('');

  useEffect(() => {
    getTree();
    return () => {};
  }, []);

  const getTree = () => {
    request('/dept/list', {
      method: 'GET',
    }).then((res: any) => {
      dataHandler(res.result);
    });
  };

  const dataHandler = (res: any) => {
    var reqData = res.map((it: any) => {
      it.key = it.dept_id;
      it.title = it.dept_name;
      it.manager_ids = it.manager_id?.split(',') || [];
      it.parent_idBack = it.parent_id;
      it.parent_nameBack = it.parent_name;
      return it;
    });

    var firstArrStr = reqData[0].dept_id;
    menuSelect(firstArrStr);
    setreqData(reqData);
    setfirstArr(firstArrStr);
    var newReqData = menusNest(reqData, 0, 'parent_id');
    setTreeData(newReqData);
  };

  const onSelect = (row: any) => {
    if (row[0]) {
      var obj: any = reqData.find((it: any) => it.dept_id === row[0]);
      console.log('obj -> :', obj);
      menuSelect(row[0]);
    }
  };

  return (
    <>
      {treeData.length ? (
        <Tree
          showLine
          blockNode
          autoExpandParent
          defaultSelectedKeys={[firstArr]}
          defaultExpandedKeys={[firstArr]}
          treeData={treeData}
          onSelect={onSelect}
          className="my-tree tree-wrap"
        ></Tree>
      ) : null}
    </>
  );
}
