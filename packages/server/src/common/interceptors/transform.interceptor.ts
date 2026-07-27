import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface SuccessResponse<T> {
  code: number
  message: string
  data: T
  meta?: Record<string, any>
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((result) => {
        if (result && typeof result === 'object' && 'code' in result) {
          return result as SuccessResponse<T>
        }
        // If result is { data, meta }, unwrap
        if (result && typeof result === 'object' && 'data' in result && 'meta' in result) {
          return {
            code: 0,
            message: 'success',
            data: result.data,
            meta: result.meta,
          }
        }
        return {
          code: 0,
          message: 'success',
          data: result,
        }
      }),
    )
  }
}
