import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'fuyebang-jwt-secret-dev',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}))
