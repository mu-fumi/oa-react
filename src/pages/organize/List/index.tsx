import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Tree, Empty } from 'antd';
import {
  CarryOutOutlined,
  FormOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Link } from 'umi';
import { ls, nest } from '@/utils/utils';

import './list.less';
import request from '@/utils/request';

export default function list() {
  const [treeData, setTreeData] = useState([]);
  const [reqData, setreqData] = useState([]);
  const [selectObject, setSelectObject] = useState<any>({});

  let getTree = () => {
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
      if (it.manager_name) {
        it.managerList = it.manager_name
          ?.split(',')
          .map((name: any, ind: number) => ({
            username: name,
            userid: it.manager_id?.split(',')[ind],
          }));
      }
      it.managerListBack = it.managerList || [];
      it.parent_idBack = it.parent_id;
      it.parent_nameBack = it.parent_name;
      return it;
    });
    setreqData(reqData);
    var newReqData = nest(reqData, 0, 'parent_id');
    setTreeData(newReqData);
  };

  useEffect(() => {
    getTree();
    return () => {};
  }, []);

  const exportFile = () => {
    var url =
      process.env.APP_API_BASE_URL +
      '/v1' +
      '/dept/export?token=' +
      ls.get('token');
    window.open(url);
  };

  const edit = (e: any, row: any) => {
    e.stopPropagation();
    console.log('row -> :', row);
  };
  const del = (e: any, row: any) => {
    e.stopPropagation();
    console.log('row -> :', row);
  };
  const onSelect = (row: any) => {
    var obj = reqData.find((it: any) => it.dept_id === row[0]);
    setSelectObject(obj);
  };

  return (
    <div>
      <Row className="top-row">
        <Col span={12} className="top-left">
          <span className="bar"></span>
          <span className="text">组织维护</span>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Link target="_blank" to="/import/dept">
            <Button type="primary"> 导入 </Button>
          </Link>
          &nbsp; &nbsp;
          <Button type="primary" onClick={exportFile}>
            导出
          </Button>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}>
          <div className="gutter-row">
            <Tree
              showLine
              blockNode
              defaultExpandedKeys={['0-0-0']}
              treeData={treeData}
              onSelect={onSelect}
              className="my-tree tree-wrap"
              titleRender={(row: any) => {
                return (
                  <>
                    <div className="tit">{row.title}</div>
                    <div className="btns">
                      <FormOutlined onClick={e => edit(e, row)} />
                      <DeleteOutlined onClick={e => del(e, row)} />
                    </div>
                  </>
                );
              }}
            ></Tree>
          </div>
        </Col>
        <Col span={18}>
          <div className="gutter-row">
            {selectObject.dept_id ? <div>46546565</div> : <Empty />}
          </div>
        </Col>
      </Row>
    </div>
  );
}
