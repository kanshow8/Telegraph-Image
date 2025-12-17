// _middleware.js - 简化兼容版本
export function onRequest(context) {
  const { request, env } = context;
  
  // 1. 读取环境变量
  const USER = env.GLOBAL_USER;
  const PASS = env.GLOBAL_PASS;
  
  // 2. 检查是否已设置
  if (!USER || !PASS) {
    return new Response('认证未配置', { status: 500 });
  }
  
  // 3. 获取请求头中的认证信息
  const authHeader = request.headers.get('Authorization');
  
  // 4. 验证逻辑
  if (authHeader) {
    try {
      const base64Credentials = authHeader.split(' ')[1];
      const textDecoder = new TextDecoder();
      const credentials = textDecoder.decode(Uint8Array.from(atob(base64Credentials), c => c.charCodeAt(0)));
      const [username, password] = credentials.split(':');
      
      if (username === USER && password === PASS) {
        // 验证通过，继续处理请求
        return context.next();
      }
    } catch (e) {
      // 认证头解析失败，视为未认证
    }
  }
  
  // 5. 认证失败，返回401
  return new Response('需要身份验证', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"'
    }
  });
}
