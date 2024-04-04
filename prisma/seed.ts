import { prisma } from "../src/lib/prisma"

async function seed() {
    await prisma.event.create({
        data: {
            id: 'd46f4b20-0940-4837-b1db-1dfa332e600f',
            title: 'Unite Summit',
            slug: 'unite-summit',
            details: 'Um evento para devs apaixonados por código',
            maximumAttendees: 120,
        }
    })
}

seed().then(() => {
    console.log("Database seeded!")
    prisma.$disconnect()
})