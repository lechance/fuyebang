import { registerAs } from '@nestjs/config'

export default registerAs('wechat', () => ({
  appId: process.env.WECHAT_APPID || '',
  secret: process.env.WECHAT_SECRET || '',
  loginUrl: 'https://api.weixin.qq.com/sns/jscode2session',
}))
