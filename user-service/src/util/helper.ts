import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const saltRounds = 10;
export const convertPassword = async (plainPassword:string) => {
    try {
       return await bcrypt.hash(plainPassword,saltRounds)
    } catch (error) {
        console.log(error)
    }
}

export const comparePassword = async (password:string,hashPassword) => {
    try {
        return await bcrypt.compare(password, hashPassword)
    } catch (error) {
        console.log(error)
    }
}

export const checkMongoIdValid = (id:string) => {
    return !!mongoose.isValidObjectId(id)
}

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