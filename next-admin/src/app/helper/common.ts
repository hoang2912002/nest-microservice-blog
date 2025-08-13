import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from "@/constant";
import { HttpStatus } from "./httpStatus";
import { Blob } from "buffer";
import { uploadChunk } from "../lib/action/post";
import { v4 as uuidv4 } from 'uuid';
import { formatDistanceToNowStrict } from "date-fns";
import dayjs from "dayjs";
export const nameMap: Record<string, string> = {
    like: 'Like',
    notification: 'Notification',
    post: 'Post',
    create: 'Create',
    all: 'All',
    user: 'User',
    edit: 'Edit',
    delete: 'Delete',
    management: 'Management',
    comment: 'Comment',
    inbox: 'Inbox',
    home: 'Home',
    role: 'Role',
    setting: 'Setting',
}

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

export const convertTakeSkip = ({
    page,
    pageSize
}:{
    page?:number,
    pageSize?:number
}) => {
    return {
        skip: ((page ? page : DEFAULT_PAGE)-1) *(pageSize ??DEFAULT_PAGESIZE ),
        take: pageSize ?? DEFAULT_PAGESIZE
    }
}

// export const handleChunkFile = async (
//   file?: File,
//   chunkSize = 1024 * 1024,
// ) => {
//     if (!file) return
//     const chunks = [], chunkPromise = [];
//     let startPos = 0;
//     while(startPos < file.size){
//         chunks.push(file.slice(startPos, startPos + chunkSize))
//         startPos += chunkSize;
//     }

//     if(!chunks.length){
//         return
//     }
//     const fileNameRandom = Math.random().toString().slice(2,7)
//     chunks.map((ck, index) => {
//         const data = new FormData();
//         const nameFileFinal = fileNameRandom + '-' + file.name + '-' + index
//         data.set("name", nameFileFinal);

//         data.append('files', ck)
//         chunkPromise.push(uploadChunk(data))
//     })
//     // call merge api
//     // await Promise.all(chunkPromise);
// }

export const handleChunkFile = async (
  file?: File,
  chunkSize = 512 * 1024,
) => {
  if (!file) return;

  const chunkPromise = [];
  let start = 0;
  const totalChunks = Math.ceil(file.size / chunkSize);
//   const fileNameBase = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`;
  const fileNameBase = `${Date.now()}-${file.name}`;

  for (let i = 0; i < totalChunks; i++) {
    const chunk = file.slice(start, start + chunkSize);
    start += chunkSize;

    // Gửi từng chunk như 1 file riêng với tên tùy chỉnh
    // const chunkFile = new File([chunk], `${fileNameBase}-part-${i}`, {
    //   type: file.type,
    // });
    const base64 = await fileToBase64(chunk)
    chunkPromise.push(uploadChunk(base64,fileNameBase,i.toString()));
  }
  await Promise.all(chunkPromise);
  return fileNameBase
//   await mergeChunks(fileNameBase, totalChunks);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const convertTimeChat = (date: Date) => {
  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = now.diff(target, "minute");
  const diffHours = now.diff(target, "hour");
  const diffDays = now.diff(target, "day");

  if (diffMinutes < 60) return `${diffMinutes}m`; // phút
  if (diffHours < 24) return `${diffHours}h`; // giờ
  if (diffDays < 7) return `${diffDays}d`; // ngày
  return target.format("DD/MM/YYYY"); // fallback
}

export const ROLE = {
    ADMIN: "1010-002",
    USER: "1010-001"
}