// _middleware.js - 为整个站点启用HTTP基础认证
export const onRequest = async (context) => {
  const { request, next, env } = context;
  
  // 1. 从环境变量中读取用户名和密码
  const USER = env.GLOBAL_USER;
  const PASS = env.GLOBAL_PASS;

  // 2. 检查环境变量是否已正确设置
  if (!USER || !PASS) {
    return new Response('服务器认证未配置，请联系管理员。', {
      status: 500,
      statusText: 'Internal Server Error'
    });
  }

  // 3. 检查请求头中是否包含认证信息
  const authHeader = request.headers.get('Authorization');
  
  if (authHeader) {
    // 用户已尝试登录，验证凭据
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');
    
    if (username === USER && password === PASS) {
      // 认证成功，继续处理请求（显示网站）
      return next();
    }
  }
  
  // 4. 认证失败或未提供认证，返回401要求登录
  return new Response('需要身份验证', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area", charset="UTF-8"',
    },
  });
};