import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePostDTO, CreatePostInput } from './dto/create-post.input';
import { UpdatePostDTO, UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorResponse, successResponse } from 'src/util/helper';
import { join } from 'path';
import * as fs from 'fs';
import * as fsMerge from 'fs/promises';
import { SupbaseService } from 'src/supbase/supbase.service';
import slugify from 'slugify';
import { Client } from '@elastic/elasticsearch';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supbaseService: SupbaseService,
    @Inject('ELASTIC_CLIENT') 
    private readonly esClient: Client,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ){}

  renderSlug(title: string){
    return slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  async create(createPostDTO: CreatePostDTO) {
    const slug = this.renderSlug(createPostDTO.title)
    const data  = await this.prismaService.post.create({
      data:{
        ...createPostDTO,
        slug
      }
    })


    await this.esClient.index({
      index: 'posts',
      id: data?.id.toString(),
      document: {
        title: data.title,
        content: data.content,
        slug: data.slug,
        thumbnail: data.thumbnail,
        authorId: data.authorId,
        published: data.published,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return data;
  }

  async findAll({skip,take}:{skip:number,take:number}) {
    try {
      const cacheValue = await this.cacheManager.get(`post_${skip}_${take}`)
      if(cacheValue){
        return cacheValue
      }
      const dataRes =  await this.prismaService.post.findMany({
        skip,
        take,
      })
      await this.cacheManager.set(`post_${skip}_${take}`, dataRes,60000);
      return dataRes
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

  // async getAllPost_ForElastic(content: string){
  //   try {
  //     const whereCondition = {
  //       OR: [
  //         { title: { contains: content.toLowerCase() } },
  //         { content: { contains: content.toLowerCase() } },
  //       ],
  //     };
  //     const queryES = this.esClient.search({
  //       index: 'posts',
  //       query: {
  //         multi_match: {
  //           query: content,
  //           fields: ['title', 'content'],
  //         },
  //       },
  //     });
  //     const queryCountPost_Prisma = this.prismaService.post.count({
  //       where:  whereCondition
  //     })
  //     const [esResult,prisResultCount] = await Promise.all([
  //       queryES,queryCountPost_Prisma
  //     ])
  //     let hits = esResult.hits.hits.map((h: any) => h._source);
  //     let count_El_Record = esResult.hits.total?.value
  //     if(!hits.length || +prisResultCount !== +count_El_Record){
  //       await this.prismaService.post.findMany({
  //         where: whereCondition
  //       })

  //     }
  //     return 1
  //   } catch (error) {
  //     throw new Error('Lỗi máy chủ!')
  //   }
  // }

  async getAllPost_ForElastic(content: string) {
    try {
      const whereCondition = {
        OR: [
          { title: { contains: content.toLowerCase() } },
          { content: { contains: content.toLowerCase() } },
        ],
      };
      let queryES
      // 1. Search Elastic trước
      if (content && content.trim() !== "") {
        // Có content → search theo nội dung
        queryES = this.esClient.search({
          index: "posts",
          size: 50,
          query: {
            multi_match: {
              query: content,
              fields: ["title", "content"],
            },
          },
        });
      } else {
        // Không có content → lấy 50 bài mới nhất
        queryES = this.esClient.search({
          index: "posts",
          size: 50,
          sort: [{ createdAt: { order: "desc" } }],
          query: { match_all: {} },
        });
      }

      // 2. Đếm tổng bản ghi trong Prisma
      const queryPosts = this.prismaService.post.findMany({
        where: whereCondition,
      });

      const [esResult, prismaPosts] = await Promise.all([
        queryES,
        queryPosts,
      ]);
      const prismaCount = prismaPosts.length;
      const hits = esResult.hits.hits.map((h: any) => ({
        id: parseInt(h._id),
        ...h._source,
      }));
      const esTotal = (esResult.hits.total as any)?.value ?? esResult.hits.total ?? 0;


      // 3. Nếu số lượng khác nhau → check record thiếu
      if (+prismaCount !== +esTotal && +prismaCount > + esTotal) {
        // Lấy tất cả record trong Prisma
        const esIds = new Set(hits.map((h: any) => h.id));

        // Lọc ra những record còn thiếu
        const missingPosts = prismaPosts.filter((p) => !esIds.has(p.id));

        if (missingPosts.length > 0) {
          // Insert vào Elastic
          const body = missingPosts.flatMap((doc) => [
            { index: { _index: 'posts', _id: doc.id.toString() } },
            {
              title: doc.title,
              content: doc.content,
              slug: doc.slug,
              thumbnail: doc.thumbnail,
              authorId: doc.authorId,
              published: doc.published,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
            },
          ]);

          await this.esClient.bulk({ refresh: true, body });
        }

        // Trả về dữ liệu đã đồng bộ
        return [...hits, ...missingPosts];
      }

      // 4. Trả về data từ Elastic (đủ rồi thì khỏi sync)
      return hits;
    } catch (error) {
      console.error(error);
      throw new Error('Lỗi máy chủ!');
    }
  }

  async countAllPost_ForElastic(content: string){
    return this.prismaService.post.count({
      where:  {
        OR: [
          { title: { contains: content.toLowerCase() }},
          { content: { contains: content.toLowerCase() }},
        ],
      }
    })
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
    dataUpdate.slug = this.renderSlug(updatePostDTO.title)
    return await this.prismaService.post.update({
      where: {
        id
      },
      data:{
        ...dataUpdate
      },
    })
  }

  
  async remove(id: number) {
    try {
      await this.prismaService.post.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // Ví dụ: nếu id không tồn tại
      console.error('Delete failed:', error);
      return false;
    }
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

  async getAllPost_ForComment (take: number){
    return await this.prismaService.post.findMany({
      skip:0,
      take,
    })
  }

}
