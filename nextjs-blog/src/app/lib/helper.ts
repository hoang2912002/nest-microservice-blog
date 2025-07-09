import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from "@/constants"
import { HttpStatus } from "./error";
import { NextResponse } from "next/server";

export const convertTakeSkip = ({page,pageSize}:{page?:number,pageSize?:number}) => {
    return {
        skip: ((page ? page : DEFAULT_PAGE)-1) *(pageSize ??DEFAULT_PAGESIZE ),
        take: pageSize ?? DEFAULT_PAGESIZE
    }
}
export const successResponse = (data: any, message = 'Thành công') => {
  return {
    success: true,
    message,
    data,
    statusCode: HttpStatus.OK
  };
};

export const errorResponse = (message = 'Lỗi xảy ra', statusCode = HttpStatus.BAD_REQUEST,fieldError="") => {
    return {
        success: false,
        message,
        statusCode,
        fieldError
    };
};


export const getPagesToShow = ({
    currentPage=DEFAULT_PAGE, totalPages=1
}: 
{
    currentPage:number, totalPages:number
}) => {
    const delta = 2;
    const range: (number | string)[] = []
    let left = currentPage - delta
    let right = currentPage + delta

    // Điều chỉnh giới hạn
    if (left < 2) {
        right += 2 - left
        left = 2
    }

    if (right > totalPages - 1) {
        left -= right - (totalPages - 1)
        right = totalPages - 1
    }
    left = Math.max(left, 2)

    // Trang đầu
    range.push(1)

    // Ellipsis nếu cần
    if (left > 2) range.push("...")

    // Các trang ở giữa
    for (let i = left; i <= right; i++) {
        range.push(i)
    }

    // Ellipsis nếu cần
    if (right < totalPages - 1) range.push("...")

    // Trang cuối
    if (totalPages > 1) range.push(totalPages)

    return range
}