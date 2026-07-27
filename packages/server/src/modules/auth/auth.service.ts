import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async wechatLogin(code: string) {
    // In development, use a mock WeChat login
    // In production, exchange code for openId via WeChat API
    let openId: string
    try {
      openId = await this.exchangeCodeForOpenId(code)
    } catch {
      // For development: allow mock login with code as openId
      openId = `mock_${code}_${Date.now()}`
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { openId } })
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          openId,
          nickname: `用户${openId.slice(-6)}`,
          avatarUrl: null,
        },
      })
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })
    }

    const token = this.generateToken(user)

    return {
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        role: user.role,
        createdAt: user.createdAt,
      },
    }
  }

  private generateToken(user: { id: string; role: string }) {
    return this.jwtService.sign({
      id: user.id,
      role: user.role,
    })
  }

  private async exchangeCodeForOpenId(code: string): Promise<string> {
    const appId = this.config.get<string>('wechat.appId')
    const secret = this.config.get<string>('wechat.secret')

    if (!appId || !secret) {
      throw new Error('WeChat config not found')
    }

    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`

    const response = await fetch(url)
    const data = await response.json()

    if (data.errcode) {
      throw new UnauthorizedException(`微信登录失败: ${data.errmsg}`)
    }

    return data.openid
  }
}
