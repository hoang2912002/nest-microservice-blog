import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePostDTO, CreatePostInput, GetAllPostDTO } from './dto/create-post.input';
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
      // const dataRes =  await this.prismaService.post.findMany({
      //   skip:3000000,
      //   take,
      // })
      const pivotId = await this.getPivotId(skip);
      if (!pivotId) {
        return { edges: [], pageInfo: { startCursor: null, endCursor: null } };
      }
      const posts = await this.prismaService.post.findMany({
        take,
        cursor: { id: pivotId },
        orderBy: { id: 'asc' },
      });

      const edges = posts.map(post => ({
        cursor: post.id,
        node: post,
      }));
      const resultData = {
        edges,
        pageInfo: {
          startCursor: edges.length ? edges[0].cursor : null,
          endCursor: edges.length ? edges[edges.length - 1].cursor : null,
        },
      };
      await this.cacheManager.set(`post_${skip}_${take}`, resultData,60000);
      return resultData
    } catch (error) {
      throw new Error('Lỗi máy chủ!')
    }
  }

  
  async countAllPost(){
    try {
      // const result = await this.prismaService.post.aggregate({
      //   _count: { id: true },
      // });
      // return result._count.id;
      const cacheValue = await this.cacheManager.get(`post_count`)
      if(cacheValue){
        return cacheValue
      }
      const resultData =  await this.prismaService.post.count()
      await this.cacheManager.set(`post_count`, resultData,60000);
      return resultData
    } catch (error) {
      throw new Error('Lỗi máy chủ!')
    }
  }

  async getPivotId(skip: number) {
    try {
      const cacheKey = `pivot_${skip}`;
      const cacheValue = await this.cacheManager.get<number>(cacheKey);
      if (cacheValue) {
        return cacheValue;
      }

      const [pivot] = await this.prismaService.post.findMany({
        skip,
        take: 1,
        orderBy: { id: 'asc' },
      });

      if (pivot) {
        await this.cacheManager.set(cacheKey, pivot.id, 60000);
        return pivot.id;
      }
      return null;
    } catch (error) {
      throw new Error(`Lỗi máy chủ, ${error}`);
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

  async getAllPost_ForElastic({content,skip}:{
    content: string,
    skip: number
  }) {
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
          from:skip,
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
          from:skip,
          sort: [{ createdAt: { order: "desc" } }],
          query: { match_all: {} },
        });
      }
      const esResult = await queryES
      const hits = esResult.hits.hits.map((h: any) => ({
        id: parseInt(h._id),
        ...h._source,
      }));
      return hits
      // const cacheValue = await this.cacheManager.get(`post_elastic_search`)
      // if(cacheValue){
      //   return cacheValue
      // }
      // // 2. Đếm tổng bản ghi trong Prisma
      // const queryPosts = this.prismaService.post.findMany({
      //   where: whereCondition,
      //   select: { id: true },
      // });
      // const [esResult, prismaPosts] = await Promise.all([
      //   queryES,
      //   queryPosts,
      // ]);
      // this.cacheManager.set(`post_elastic_search`, prismaPosts,60000);
      // const prismaCount = prismaPosts.length;
      // const hits = esResult.hits.hits.map((h: any) => ({
      //   id: parseInt(h._id),
      //   ...h._source,
      // }));
      // const esTotal = (esResult.hits.total as any)?.value ?? esResult.hits.total ?? 0;


      // // 3. Nếu số lượng khác nhau → check record thiếu
      // if (+prismaCount !== +esTotal && +prismaCount > +esTotal) {
      //   const esIds = new Set<number>(hits.map((h: any) => h.id));

      //   // Lấy tất cả ID từ Prisma
      //   const missingIds = prismaPosts
      //     .map(p => p.id)
      //     .filter(id => !esIds.has(id));

      //   console.log(`Missing ${missingIds.length} records, syncing...`);

      //   const batchSize = 10000;
      //   const syncedPosts: any[] = [];

      //   for (let i = 0; i < missingIds.length; i += batchSize) {
      //     const batchIds = missingIds.slice(i, i + batchSize);

      //     const posts = await this.prismaService.post.findMany({
      //       where: { id: { in: batchIds } },
      //       select: {
      //         id: true,
      //         title: true,
      //         content: true,
      //         slug: true,
      //         thumbnail: true,
      //         authorId: true,
      //         published: true,
      //         createdAt: true,
      //         updatedAt: true,
      //       },
      //     });

      //     const body = posts.flatMap((doc) => [
      //       { index: { _index: 'posts', _id: doc.id.toString() } },
      //       { ...doc },
      //     ]);

      //     const bulkResult = await this.esClient.bulk({ refresh: true, body });

      //     if (bulkResult.errors) {
      //       console.error("Bulk insert errors:", bulkResult.items);
      //     }

      //     syncedPosts.push(...posts);
      //   }

      //   return [...hits, ...syncedPosts];
      }
    catch (error) {
      console.error(error);
      throw new Error('Lỗi máy chủ!');
    }
  }

  async importEs(){
    const batchSize = 10000;
    const count = await this.prismaService.post.count()
    for (let i = 1; i < count; i += batchSize) {
      const posts = await this.prismaService.post.findMany({
        cursor: { id: i },
        take:10000,
        select: {
          id: true,
          title: true,
          content: true,
          slug: true,
          thumbnail: true,
          authorId: true,
          published: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const body = posts.flatMap((doc) => [
        { index: { _index: 'posts', _id: doc.id.toString() } },
        { ...doc },
      ]);

      const bulkResult = await this.esClient.bulk({ refresh: true, body });

      if (bulkResult.errors) {
        console.error("Bulk insert errors:", bulkResult.items);
      }
    }
    return true
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
  async findAllByAdmin({skip,take}:{
    skip:number,
    take:number
  }) {
    // try {
    //   return await this.prismaService.post.findMany({
    //     skip,
    //     take,
    //   })
    // } catch (error) {
    //   throw new Error('Lỗi máy chủ!',error)
    // }
    
    try {
      const cacheValue = await this.cacheManager.get(`post_${skip}_${take}`)
      if(cacheValue){
        return cacheValue
      }
      const pivotId = await this.getPivotId(skip);
      if (!pivotId) {
        return { edges: [], pageInfo: { startCursor: null, endCursor: null } };
      }
      const posts = await this.prismaService.post.findMany({
        take,
        cursor: { id: pivotId },
        orderBy: { id: 'asc' },
      });

      // const edges = posts.map(post => ({
      //   cursor: post.id,
      //   node: post,
      // }));
      // const resultData = {
      //   edges,
      //   pageInfo: {
      //     startCursor: edges.length ? edges[0].cursor : null,
      //     endCursor: edges.length ? edges[edges.length - 1].cursor : null,
      //   },
      // };
      await this.cacheManager.set(`post_${skip}_${take}`, posts,60000);
      return posts
    } catch (error) {
      console.log(error)
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
