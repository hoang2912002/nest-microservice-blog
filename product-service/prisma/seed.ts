import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';
import { Transport,ClientOptions, ClientProxyFactory  } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import slugify from 'slugify';
const prisma = new PrismaClient()
const options: ClientOptions = {
  transport: Transport.REDIS,
  options: {
    host: process.env.REDIS_HOST || undefined,
    port: process.env.REDIS_PORT ?  parseInt(process.env.REDIS_PORT) : 6379,
    retryAttempts: 5,   // 👈 thử lại 5 lần
    retryDelay: 3000,   // 👈 delay 3s mỗi lần thử
  },
};
const userClient = ClientProxyFactory.create(options);

function generateSlug(title:string):string{
    return slugify(title, { lower: true, strict: true });
}

async function main() {
    //1000
    const [user, userArrName] = await Promise.all([
        lastValueFrom(userClient.send("findAllArrId",{skip:1000,take:499900})),
        lastValueFrom(userClient.send("findAllArrName",{skip:1000,take:499900}))
    ])
    // const user =  await firstValueFrom(userClient.send("findAllArrId",{}))
    // const userArrName =  await firstValueFrom(userClient.send("findAllArrName",{}))
    console.log(userArrName)
    const posts = Array.from({ length: 4999000 }).map(() => {
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
    
    for (const post of posts) {
        const postData =  await prisma.post.create({
            data: {
                ...post
            }
        })
        const parentComment = await Promise.all(
            Array.from({length:40}).map(async ()=>{
                const userData = faker.helpers.arrayElement(user.data) as string
                const userInfo = userArrName.data.find((arr) => arr._id === userData);
                return (

                    prisma.comment.create({
                        data:{
                            content: faker.lorem.sentence(),
                            authorId: userData,
                            postId: postData.id,
                            parentId: null,
                            userName: userInfo?.name ?? null
                        }
                    })
                )
            }
            )
        )

        for (let i = 0; i < 4; i++) {
            const parent = faker.helpers.arrayElement(parentComment);
            const userData = faker.helpers.arrayElement(user.data) as string
            const userInfo = userArrName.data.find((arr) => arr._id === userData);
            const check = await prisma.comment.create({
                data:{
                    content: faker.lorem.sentence(),
                    authorId: userData,
                    postId: postData.id,
                    parentId: parent.id,  
                    userName: userInfo?.name ?? null
                }
            })
            console.log( )
        }
        

        const uniqueUserLike = faker.helpers
            .uniqueArray(() => faker.helpers.arrayElement(user.data) as string, 40)
        
        await prisma.like.createMany({
            data: uniqueUserLike.map((userId) => ({
                userId,
                postId: postData.id,
            }))            
        })

    }
    // const total = 4_999_000; // tổng số post
    // const batchSize = 10_000; // số lượng insert mỗi batch
    // let inserted = 0;

    // for (let i = 0; i < total; i += batchSize) {
    //     const posts = Array.from({ length: batchSize }).map(() => {
    //     const title = faker.lorem.sentence();
    //     return {
    //         title,
    //         slug: generateSlug(title),
    //         content: faker.lorem.paragraphs(3),
    //         thumbnail: faker.image.urlPicsumPhotos(),
    //         authorId: faker.helpers.arrayElement(user.data) as string, // TODO: thay bằng userId thật
    //         published: true,
    //     };
    //     });

    //     await prisma.post.createMany({ data: posts });
    //     inserted += posts.length;
    //     console.log(`Inserted ${inserted}/${total}`);
    // }
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