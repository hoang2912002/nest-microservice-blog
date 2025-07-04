import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient()

async function main() {
    // const post = Array.from({length:400}).map(
    //     () => ({
    //         title: faker.lorem.sentence(),
    //         slug: generateSlug(faker.lorem.sentence()),
    //         content: faker.lorem.paragraphs(3),
    //         thumbnail: faker.image.urlLoremFlickr(),
    //         authorId: faker.number.int({min:1,max:10}),
    //         published: true,
    //     })
    // )
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