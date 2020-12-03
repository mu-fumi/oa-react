import React, { useState } from 'react';
import { Card, Upload, Button, message } from 'antd';

export default function ImportPeople() {
  const [loading, setLoading] = useState(false);
  const [errinfo, setErrinfo] = useState(false);
  const [errArr, setErrArr] = useState([]);
  const upUrl = process.env.APP_API_BASE_URL + '/v1';
  const headers = {
    authorization: 'authorization-text',
  };

  const handleChange = (info: any) => {
    console.log('info -> :', info.file);
    if (info.file.status !== 'uploading') {
      setLoading(true);
    }
    if (info.file.status === 'done') {
      setLoading(false);
      var response = info.file.response;
      if (response.code === 200) {
        message.success(response.msg);
        if (response.result.length) {
          setErrinfo(true);
          setErrArr(response.result);
        } else {
          setErrinfo(false);
          setErrArr([]);
        }
      } else {
        message.error(response.msg);
        setErrinfo(false);
        setErrArr([]);
      }
    } else if (info.file.status === 'error') {
      setErrinfo(false);
      setErrArr([]);
    }
  };

  return (
    <div className="white">
      <Card
        title="成本信息 导入步骤："
        bordered={false}
        extra={
          <Upload
            name="file"
            action={upUrl + '/user/import_salary'}
            headers={headers}
            showUploadList={false}
            onChange={handleChange}
          >
            <Button loading={loading} type="primary">
              导入
            </Button>
          </Upload>
        }
      >
        <p>
          1、下载导入模板。
          <a
            href="http://file.xinhong.site/price.xlsx"
            download="成本导入模板.xlsx"
          >
            （点击下载）
          </a>
        </p>
        <p>2、按照导入模板的要求，添加成本信息。</p>
        <p>3、点击“导入”按钮，开始导入。</p>
        <p>可在下框中查看导入失败的数据。</p>
      </Card>
      {errinfo && (
        <Card style={{ marginTop: '10px' }} title="导入错误信息：">
          {errArr.map((it, index) => (
            <p key={index}>{it}</p>
          ))}
        </Card>
      )}
    </div>
  );
}
