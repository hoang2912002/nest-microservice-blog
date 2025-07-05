import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';
import { Transport,ClientOptions, ClientProxyFactory  } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import slugify from 'slugify';
const prisma = new PrismaClient()
const options: ClientOptions = {
  transport: Transport.REDIS,
  options: {
    host: process.env.REDIS_HOST || undefined,
    port: process.env.REDIS_PORT ?  parseInt(process.env.REDIS_PORT) : 6379,
  },
};
const userClient = ClientProxyFactory.create(options);

function generateSlug(title:string):string{
    return slugify(title, { lower: true, strict: true });
}

async function main() {
    
    const user =  await firstValueFrom(userClient.send("findAllArrId",{}))
    const posts = Array.from({ length: 1000 }).map(() => {
        const title = faker.lorem.sentence();
        return {
            title: title,
            slug: generateSlug(title),
            content: faker.lorem.paragraphs(3),
            thumbnail: faker.image.urlPicsumPhotos(),
            authorId: faker.helpers.arrayElement(user.data) as string,
            published: true,
        }
    });
    await Promise.all(posts.map(async(post)=> await prisma.post.create({
        data: {
            ...post,
            //trong quá trình tạo post đồng thời tạo 20 bản ghi liên kết vs post
            //làm như này ko cần phải khai báo foreign key ở comments
            comments:{
                createMany:{
                    data: Array.from({length:40}).map(()=>({
                        content: faker.lorem.sentence(),
                        authorId: faker.helpers.arrayElement(user.data) as string,
                    }))
                }
            }
        }
    })))
    console.log("Seeding Completed!")

}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })