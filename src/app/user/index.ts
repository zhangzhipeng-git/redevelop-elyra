// to-do
/** 获取用户姓名 */
let identify: Promise<any> = Promise.resolve(
  window.location.href.split('/')[4]
);
export default identify;
