import { Tool } from '@langchain/core/tools';
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

class GetTopPostsTool extends Tool {
  readonly name = "get-top-posts";
  readonly description = "Lấy các bài đăng thịnh hành, input là số lượng cần lấy";

  async _call(input: string): Promise<string> {
    const limit = parseInt(input) || 5;
    // TODO: query DB thật
    return JSON.stringify({ message: `Trả về ${limit} bài viết top` });
  }
}
export const getTopPostsTool = new GetTopPostsTool();

class GetUserInfoTool extends Tool {
  readonly name = "get-user-info";
  readonly description = "Lấy thông tin user hoặc admin";

  async _call(input: string): Promise<string> {
    // TODO: query DB thật
    return JSON.stringify({ user: "admin", info: "Thông tin demo" });
  }
}
export const getUserInfoTool = new GetUserInfoTool();
