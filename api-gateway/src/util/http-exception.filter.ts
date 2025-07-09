// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
// } from '@nestjs/common';
// import { Response } from 'express';

// @Catch(HttpException)
// export class CustomHttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx     = host.switchToHttp();
//     const res     = ctx.getResponse<Response>();
//     const status  = exception.getStatus();
//     const response: any = exception.getResponse();

//     const message = typeof response === 'string' ? response : response.message;
//     const fieldError = response.fieldError || "";

//     res.status(status).json({
//       success: false,
//       message,
//       fieldError,
//       statusCode: status,
//     });
//   }
// }
