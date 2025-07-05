import { HttpException, HttpStatus } from "@nestjs/common";

export const successResponse = (data: any, message = 'Thành công') => {
  return {
    success: true,
    message,
    data,
    statusCode: HttpStatus.OK
  };
};

export const errorResponse = (message = 'Lỗi xảy ra', statusCode = HttpStatus.BAD_REQUEST) => {
  throw new HttpException(
    {
      success: false,
      message,
    },
    statusCode,
  );
};