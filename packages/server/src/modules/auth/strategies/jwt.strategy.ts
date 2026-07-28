import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../../prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    })
  }

  async validate(payload: { id: string; role: string }) {
    // Check regular users
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, role: true, status: true },
    })
    if (user) {
      if (user.status !== 'ACTIVE') throw new UnauthorizedException('用户已被禁用')
      return { id: user.id, role: user.role }
    }
    // Check admin users
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: payload.id },
      select: { id: true, role: true, isActive: true },
    })
    if (admin) {
      if (!admin.isActive) throw new UnauthorizedException('管理员已被禁用')
      return { id: admin.id, role: admin.role }
    }
    throw new UnauthorizedException('用户不存在')
  }
}
