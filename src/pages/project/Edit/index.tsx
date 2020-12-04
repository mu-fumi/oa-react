import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Card,
  Input,
  Select,
  TreeSelect,
  InputNumber,
  DatePicker,
} from 'antd';
import { OptionData } from 'rc-select/lib/interface';
import { DataNode } from 'rc-tree-select/lib/interface';
import { history, ConnectProps } from 'umi';
import { queryDeptList, queryProjectTypes } from '@/services/baseData';
import { debounce } from 'lodash';
import PeopleSelect, { PeopleSelectProps } from '@/components/PeopleSelect';
import { nest } from '../untils';
import { projectStatusOptions, projectTypeEnum } from '../constants';
import { createProject, fetchProjectCost } from './services';
import { DATE_FORMAT, MONEY_PRECISION } from '@/constants';
import ProjectMembersSelect from '../components/ProjectMembersSelect';

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 8,
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    span: 12,
    offset: 4,
  },
};
const membersFormItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

interface EditProjectProps extends ConnectProps<{ id: string }> {}

export default (props: EditProjectProps) => {
  const { match } = props;
  const projectId = Number(match?.params.id) || null;
  const isEdit = !!projectId;

  const [baseOption, setBaseOption] = useState({
    projectTypes: [],
    deptTree: [],
  } as {
    projectTypes: OptionData[];
    deptTree: DataNode[];
  });

  const [form] = Form.useForm();

  const [projectType, setProjectType] = useState(projectTypeEnum.delivery);

  useEffect(() => {
    if (!isEdit) {
      form.resetFields();
      setProjectType(projectTypeEnum.delivery);
    } else {
      // TODO 加载编辑数据
    }
  }, [projectId]);

  useEffect(() => {
    Promise.all([queryDeptList(), queryProjectTypes()]).then(
      ([deptRes, typeRes]) => {
        setBaseOption({
          projectTypes: typeRes.result.map(item => ({
            label: item.name,
            value: item.id,
          })),
          deptTree: nest(deptRes.result, {
            parentId: 0,
            curIdField: 'dept_id',
            labelFidel: 'dept_name',
          }),
        });
      },
    );
  }, []);

  const onFinish = (values: any) => {
    const { rangeDate, ...otherValues } = values;
    createProject({
      ...otherValues,
      start_at: rangeDate[0].format(DATE_FORMAT),
      end_at: rangeDate[1].format(DATE_FORMAT),
    });
  };

  const updateBasicCost = () => {
    form
      .validateFields(['rangeDate'])
      .then(data => {
        return fetchProjectCost(data);
      })
      .then(res => {
        form.setFieldsValue({
          estimated_cost: res.result.cost,
        });
      });
  };
  const debounceUpdateBasicCost = debounce(updateBasicCost, 500);

  const projectTypeChange = (value: number) => {
    setProjectType(value);
  };

  return (
    <Card title={isEdit ? '编辑项目' : '新增项目'} style={{ width: '100%' }}>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="项目名称"
          rules={[
            {
              required: true,
              message: '项目名称必填!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="project_number" label="项目编号" initialValue="">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="项目描述" initialValue="">
          <Input.TextArea autoSize />
        </Form.Item>
        <Form.Item
          name="type_id"
          label="项目性质"
          rules={[
            {
              required: true,
              message: '项目性质必选!',
            },
          ]}
          initialValue={projectTypeEnum.delivery}
        >
          <Select
            options={baseOption.projectTypes}
            onChange={projectTypeChange}
          />
        </Form.Item>
        {projectType !== projectTypeEnum.delivery ? null : (
          <>
            <Form.Item name="pmo" label="行业PMO">
              <Input />
            </Form.Item>
            <Form.Item name="pm" label="区域PM">
              <Input />
            </Form.Item>
            <Form.Item name="outside_belongs" label="项目归属（对外）">
              <Input />
            </Form.Item>
            <Form.Item
              name="dept_id"
              label="项目归属部门（内部）"
              rules={[
                {
                  required: true,
                  message: '项目归属部门必选!',
                },
              ]}
            >
              <TreeSelect treeData={baseOption.deptTree} />
            </Form.Item>
            <Form.Item name="industry" label="所属行业">
              <Input />
            </Form.Item>
            <Form.Item name="customer_name" label="客户名称">
              <Input />
            </Form.Item>
          </>
        )}
        {projectType !== projectTypeEnum.self ? null : (
          <Form.Item
            name="dept_id"
            label="项目归属部门"
            rules={[
              {
                required: true,
                message: '项目归属部门必选!',
              },
            ]}
          >
            <TreeSelect treeData={baseOption.deptTree} />
          </Form.Item>
        )}
        <Form.Item name="status" label="项目状态">
          <Select options={projectStatusOptions} />
        </Form.Item>
        <Form.Item
          name="rangeDate"
          label="项目起止时间"
          rules={[
            {
              required: true,
              message: '项目起止时间必填!',
            },
          ]}
        >
          <DatePicker.RangePicker
            format={DATE_FORMAT}
            onChange={debounceUpdateBasicCost}
          />
        </Form.Item>
        <Form.Item
          {...membersFormItemLayout}
          name="project_members"
          rules={[
            {
              required: true,
              message: '成员信息必填!',
            },
          ]}
        >
          <PeopleSelect />
        </Form.Item>
        <Form.Item
          name="estimated_working_days"
          label="预估工时"
          rules={[
            {
              required: true,
              message: '预估工时必填!',
            },
          ]}
        >
          <InputNumber min={0} precision={1} />
        </Form.Item>
        <Form.Item
          name="estimated_cost"
          label="预估成本"
          rules={[
            {
              required: true,
              message: '预估成本必填!',
            },
          ]}
        >
          <InputNumber min={0} precision={MONEY_PRECISION} />
        </Form.Item>
        <Form.Item
          name="order_amount"
          label="预估收入"
          rules={[
            {
              required: true,
              message: '预估收入必填!',
            },
          ]}
        >
          <InputNumber min={0} precision={MONEY_PRECISION} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          &emsp;
          <Button onClick={() => history.push('/project/info')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
