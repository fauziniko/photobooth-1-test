import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const seedUsers = [
    {
      name: 'Admin User',
      email: 'admin@photobooth.com',
      password: 'admin123',
      role: 'ADMIN' as const,
    },
    {
      name: 'Regular User',
      email: 'user@photobooth.com',
      password: 'user123',
      role: 'USER' as const,
    },
  ]

  for (const seedUser of seedUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: seedUser.email },
    })

    if (existingUser) {
      console.log(`ℹ️ User already exists: ${seedUser.email}`)
      continue
    }

    const hashedPassword = await bcrypt.hash(seedUser.password, 10)

    const createdUser = await prisma.user.create({
      data: {
        name: seedUser.name,
        email: seedUser.email,
        password: hashedPassword,
        role: seedUser.role,
      },
    })

    console.log(`✅ User created: ${createdUser.email}`)
    console.log(`   Password: ${seedUser.password}`)
    console.log(`   Role: ${createdUser.role}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
