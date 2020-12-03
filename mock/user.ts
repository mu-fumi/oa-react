import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req: Request, res: Response) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}

const premTree = {
  project: {
    main: true,
    list: true,
    edit: true,
    add: true,
  },
  admin: {
    main: false,
    list: true,
    edit: true,
  },
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/v1/currentUser': {
    code: 200,
    result: {
      userid: 4,
      username: '李凤',
      login_name: 'lifeng',
      mobile: '13666666666',
      admin_type: 2,
      id_number: '',
      staff_sn: '1200061',
      allow_login: 1,
      avatar: 'http://file.xinhong.site/202011205fb77b229cb90.jpg',
      dept_id_arr: [],
      admin_type_text: '分级管理员',
      age: '',
      dept_name: '',
      fill_dept_name: '',
      remind_regular: '',
      is_regular: 0,
      positive_date: null,
      contract: [],
      latest_contract: {
        contract_id: 0,
        company: '',
        deadline: '',
        start_date: '',
        end_date: '',
        remind_renew: '',
      },
      managers_name: '',
      premTree,
    },
  },
  'POST /api/login/account': async (req: Request, res: Response) => {
    const { password, userName, type } = req.body;
    await waitTime(2000);
    if (password === 'ant.design' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === 'ant.design' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  'GET  /api/login/captcha': getFakeCaptcha,
};
