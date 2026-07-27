import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../prisma/prisma.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AdminAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    // Try admin users table first
    const admin = await this.prisma.adminUser.findUnique({ where: { username } })

    if (admin && bcrypt.compareSync(password, admin.password)) {
      const token = this.jwtService.sign({ id: admin.id, role: admin.role })
      return {
        token,
        user: { id: admin.id, username: admin.username, nickname: admin.nickname, role: admin.role },
      }
    }

    // Fallback: check regular users with admin role
    const user = await this.prisma.user.findFirst({
      where: { nickname: username, role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
    })

    if (user) {
      const token = this.jwtService.sign({ id: user.id, role: user.role })
      return {
        token,
        user: { id: user.id, nickname: user.nickname, avatarUrl: user.avatarUrl, role: user.role },
      }
    }

    // Development mock
    if (username === 'admin' && password === 'admin123') {
      const token = this.jwtService.sign({ id: 'admin-dev', role: 'ADMIN' })
      return { token, user: { id: 'admin-dev', username: 'admin', nickname: '管理员', role: 'ADMIN' } }
    }

    throw new UnauthorizedException('用户名或密码错误')
  }
}
