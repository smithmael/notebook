// prisma/seed.ts
import prisma from '../src/lib/prisma.js'; 
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🧹 Cleaning Database...');
  await prisma.rental.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('👤 Creating Real-World Users...');
  
  // 1. The Admin (System Manager)
  const admin = await prisma.user.create({
    data: { name: 'System Admin', email: 'admin@gmail.com', password: hashedPassword, role: 'ADMIN', status: 'active' }
  });

  // 2. The Owner (The person who uploaded 'The Great Gatsby')
  const owner = await prisma.user.create({
    data: { name: 'Koki Owner', email: 'koki.owner@gmail.com', password: hashedPassword, role: 'OWNER', status: 'active' }
  });

  // 3. The Renter (A regular customer who wants to rent books)
  const renter = await prisma.user.create({
    data: { name: 'John Renter', email: 'john.customer@gmail.com', password: hashedPassword, role: 'USER', status: 'active' }
  });

  console.log('📚 Creating Sample Books...');
  const book1 = await prisma.book.create({
    data: {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      category: 'Fiction',
      rentPrice: 150.0,
      totalCopies: 5,
      availableCopies: 5,
      // 🔗 These MUST be real links from your Cloudinary dashboard to see images
      coverImage: 'https://res.cloudinary.com/dxg4jsioo/image/upload/v1/sample.jpg', 
      bookFile: 'https://res.cloudinary.com/dxg4jsioo/raw/upload/v1/sample.pdf',
      ownerId: owner.id,
    }
  });

  console.log('💰 Creating Initial Rental Record...');
  const rentalDate = new Date();
  rentalDate.setMonth(rentalDate.getMonth() - 1);
  const dueDate = new Date(rentalDate);
  dueDate.setDate(dueDate.getDate() + 14); 

  await prisma.rental.create({
    data: {
      price: 150.0,
      bookId: book1.id,
      renterId: renter.id, // ✅ Fixed: The Renter is now the one who rented it
      createdAt: rentalDate,
      dueDate: dueDate,
    }
  });

  console.log('✅ Seed successful! Real users created.');
}

main()
  .catch((e) => { 
    console.error('❌ Seed Error:', e); 
    process.exit(1); 
  })
  .finally(async () => {
    await prisma.$disconnect();
  });