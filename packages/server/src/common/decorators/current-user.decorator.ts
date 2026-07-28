import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export interface CurrentUserData {
  id: string
  role: string
  [key: string]: unknown
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext): CurrentUserData | string | undefined => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user as CurrentUserData
    return data ? (user?.[data] as string | undefined) : user
  },
)
