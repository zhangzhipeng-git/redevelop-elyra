import { UserManager } from '@jupyterlab/services';

const userManager = new UserManager();

const userIdentify = userManager.ready
  .then(() => userManager.identity)
  .catch(() => {
    console.warn('获取用户身份失败!');
  });

/** 获取用户认证身份 */
export default userIdentify;
