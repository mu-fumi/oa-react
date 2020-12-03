import request from '@/utils/request';

export async function queryProjec(): Promise<any> {
  return request('/currentUser');
}
