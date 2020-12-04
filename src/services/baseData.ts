import { RequestRes } from '@/interface';
import request from '@/utils/request';

export interface IDept {
  com_id: number;
  dept_id: number;
  dept_name: string;
  dept_no: string;
  dept_type: number;
  manager_id: number;
  manager_name: string;
  parent_id: number;
  parent_name: string;
  path: string;
  path_id: string;
  remark: string;
}

export async function queryDeptList(): Promise<RequestRes<IDept[]>> {
  return request('/dept/list').catch(() => {
    return {
      code: 200,
      result: [],
    };
  });
}

export interface IProjectType {
  id: number;
  name: string;
}

export async function queryProjectTypes(): Promise<RequestRes<IProjectType[]>> {
  return request('/project/type').catch(() => {
    return {
      code: 200,
      result: [],
    };
  });
}
