// prisma/seed.ts
import prisma from '../src/lib/prisma.js'; // ✅ Use .js extension for ESM compatibility
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🧹 Cleaning Database...');
  // Delete in order to respect Foreign Key constraints
  await prisma.rental.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('👤 Creating Users...');
  const admin = await prisma.user.create({
    data: { name: 'Admin', email: 'admin@test.com', password: hashedPassword, role: 'ADMIN', status: 'active' }
  });

  const owner = await prisma.user.create({
    data: { name: 'Owner', email: 'owner@test.com', password: hashedPassword, role: 'OWNER', status: 'active' }
  });

  console.log('📚 Creating Sample Books...');
  const book1 = await prisma.book.create({
    data: {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      category: 'Fiction',
      rentPrice: 150.0,
      totalCopies: 5,
      availableCopies: 3,
      coverImage: 'https://res.cloudinary.com/dxg4jsioo/image/upload/v1/sample.jpg', 
      bookFile: 'https://res.cloudinary.com/dxg4jsioo/raw/upload/v1/sample.pdf',
      ownerId: owner.id,
    }
  });

  console.log('💰 Creating Rentals...');
  const rentalDate = new Date();
  rentalDate.setMonth(rentalDate.getMonth() - 1);
  
  const dueDate = new Date(rentalDate);
  dueDate.setDate(dueDate.getDate() + 14); 

  await prisma.rental.create({
    data: {
      price: 150.0,
      bookId: book1.id,
      renterId: admin.id, 
      createdAt: rentalDate,
      dueDate: dueDate,
    }
  });

  console.log('✅ Seed successful!');
}

main()
  .catch((e) => { 
    console.error('❌ Seed Error:', e); 
    process.exit(1); 
  })
  .finally(async () => {
    await prisma.$disconnect();
  });