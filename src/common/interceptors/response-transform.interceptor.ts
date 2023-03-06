import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map, Observable } from 'rxjs';

/**
 * Global interceptor Api 응답직전 데이터 transform
 */
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        if (statusCode < 400) {
          return {
            statusCode,
            ...instanceToPlain(data),
          };
        }
        return data;
      }),
    );
  }
}
