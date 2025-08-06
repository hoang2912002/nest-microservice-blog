import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostDTO, UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorResponse, successResponse } from 'src/util/helper';
import { join } from 'path';
import * as fs from 'fs';
import * as fsMerge from 'fs/promises';
import { SupbaseService } from 'src/supbase/supbase.service';
@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supbaseService: SupbaseService
  ){}
  create(createPostInput: CreatePostInput) {
    return 'This action adds a new post';
  }

  async findAll({skip,take}:{skip:number,take:number}) {
    try {
      return await this.prismaService.post.findMany({
        skip,
        take,
      })
    } catch (error) {
      throw new Error('Lỗi máy chủ!')
    }
  }

  async countAllPost(){
    try {
      return await this.prismaService.post.count()
    } catch (error) {
      throw new Error('Lỗi máy chủ!')
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.post.findFirst({
        where:{
          id
        },
        include:{
          tags:true
        }
      }
      )
    } catch (error) {
      throw new Error('Lỗi máy chủ!')
    }
  }

  async update(updatePostDTO: UpdatePostDTO) {
    if(!updatePostDTO.id){
      throw new Error('Not found id')
    }
    const {id,...dataUpdate} = updatePostDTO
    return await this.prismaService.post.update({
      where: {
        id
      },
      data:{
        ...dataUpdate
      },
    })
  }

  
  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  //Admin
  async findAllByAdmin({skip,take}:{skip:number,take:number}) {
    try {
      return await this.prismaService.post.findMany({
        skip,
        take,
      })
    } catch (error) {
      throw new Error('Lỗi máy chủ!',error)
    }
  }


  async uploadFileChunkPost(file:string,folderName:string,fileName:string){
    const base64Data = file.replace(/^data:.*;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');


    // 3. Đường dẫn thư mục tạm
    const basePath = join(process.cwd(), 'temp_chunks');
    const folderPath = join(basePath, folderName);
    // const tempFolder = join(process.cwd(), 'temp_chunks', folderName);

    // Tạo folder nếu chưa tồn tại
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // 4. Lưu file vào folder tạm
    const filePath = join(folderPath, `${fileName}`)
    fs.writeFileSync(filePath, buffer);
    
    // Trả về thành công
    return true;
  }

  async  mergeFiles(folderName: string) {
    const basePath = join(process.cwd(), 'temp_chunks');
    const folderPath = join(basePath, folderName);
    const mergeFileName = "merge_" + folderName
    const outputFile = join(basePath, mergeFileName);
    if (!fs.existsSync(folderPath)) {
      console.error('❌ Folder does not exist:', folderPath);
      return null;
    }

    const files = fs.readdirSync(folderPath);
    const sortedFiles = files
      .filter(f => /^\d+/.test(f)) // chỉ lấy các file chunk bắt đầu bằng số
      .sort((a, b) => {
        const aIndex = parseInt(a.split('.')[0], 10);
        const bIndex = parseInt(b.split('.')[0], 10);
        return aIndex - bIndex;
      });

    let startPos = 0;

    for (const file of sortedFiles) {
      const fileSubPath = join(folderPath, file);
      const fileSize = fs.statSync(fileSubPath).size;

      await new Promise<void>((resolve, reject) => {
        const readStream = fs.createReadStream(fileSubPath);
        const writeStream = fs.createWriteStream(outputFile, {
          flags: 'a',
          start: startPos,
        });

        readStream.pipe(writeStream);
        readStream.on('end', resolve);
        readStream.on('error', reject);
        writeStream.on('error', reject);
      });

      startPos += fileSize;
    }
    console.log(`✅ Merged file created at: ${outputFile}`);

    // 🧹 Dọn dẹp thư mục chunk sau khi merge
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`🧼 Deleted chunk folder: ${folderPath}`);

    const uploadedUrl = await this.supbaseService.uploadFile(
      outputFile,
      'hamets-project-microservice',
      mergeFileName
    )

    return uploadedUrl;
  }


//   async mergeFiles(folderName: string) {
//   const basePath = join(process.cwd(), 'temp_chunks');
//   const folderPath = join(basePath, folderName);
//   const outputFileDir = join(basePath, 'merge'); // thư mục chứa file merge, tạo nếu chưa tồn tại
//   const outputFilePath = join(outputFileDir, `${folderName}`);

//   // Tạo thư mục merge
//   await fsMerge.mkdir(outputFileDir, { recursive: true });

//   if (await fsMerge.stat(folderPath).then(s => s.isDirectory()).catch(() => false)) {
//     const files = await fsMerge.readdir(folderPath);
//     const sortedFiles = files.sort((a, b) => {
//       const aIndex = parseInt(a.split('.')[0], 10);
//       const bIndex = parseInt(b.split('.')[0], 10);
//       return aIndex - bIndex;
//     });

//     let startPos = 0;
//     let countFile = 0;

//     for (const file of sortedFiles) {
//       const fileSubPath = join(folderPath, file);
      
//       // Tạo stream đọc file
//       const streamFile = fs.createReadStream(fileSubPath);

//       // Ghi vào file merge tại vị trí startPos
//       await new Promise((resolve, reject) => {
//         streamFile.pipe(
//           fs.createWriteStream(outputFilePath, { start: startPos, flags: 'r+' })
//         ).on('finish', () => {})
//          .on('error', reject);
//       });

//       // Cập nhật startPos
//       const fileSize = (await fsMerge.stat(fileSubPath)).size;
//       startPos += fileSize;

//       countFile++;
//       if (countFile === files.length) {
//         // Sau khi ghép hết, xóa thư mục chứa các phần
//         await fsMerge.rm(folderPath, { recursive: true, force: true });
//         console.log('Đã xóa thư mục:', folderPath);
//       }
//     }

//     console.log(`Merged file đã tạo tại: ${outputFilePath}`);
//     return `Merged file đã tạo tại: ${outputFilePath}`;
//   } else {
//     console.error('Thư mục không tồn tại:', folderPath);
//     return null;
//   }
// }
}
