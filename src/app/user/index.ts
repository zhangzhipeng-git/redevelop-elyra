import { UserManager } from '@jupyterlab/services';
let identify: any = Promise.resolve();
try {
  const userManager = new UserManager();
  identify = userManager.ready
    .then(() => userManager.identity)
    .catch(() => {
      console.warn('获取用户身份失败!');
    });
} catch (e) {
  // to-do
}

/** 获取用户认证身份 */
export default identify;
