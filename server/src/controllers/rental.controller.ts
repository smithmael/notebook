// server/src/controllers/rental.controller.ts
import { Request, Response } from 'express';
import axios from 'axios';
import { rentBookSchema } from '../utils/validators';
import prisma from '../config/database'; 
import { UnauthorizedError } from '../utils/error';
import { Role } from '../generated/client';

interface AuthUser {
  id: number;
  role: Role;
  email: string;
  name: string;
}

export const rentBook = async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  if (!user) throw new UnauthorizedError('Not authenticated');

  try {
    // 🛡️ Validate the incoming body
    const payload = rentBookSchema.parse(req); 
    const { bookId } = payload.body;

    const book = await prisma.book.findUnique({ 
      where: { id: Number(bookId) } 
    });

    if (!book) return res.status(404).json({ message: "Book not found" });

    const tx_ref = `tx-${user.id}-${bookId}-${Date.now()}`;

    const chapaResponse = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      {
        amount: book.rentPrice,
        currency: 'ETB',
        email: user.email,         
        first_name: user.name.split(' ')[0] || 'Customer', 
        tx_ref: tx_ref,
        callback_url: `${process.env.BACKEND_URL}/api/rentals/webhook`,
        return_url: `${process.env.FRONTEND_URL}/bookshelf`, // Redirect back to bookshelf
        "customization[title]": `Renting ${book.title}`,
      },
      {
        headers: { 
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Payment initialized',
      checkoutUrl: chapaResponse.data.data.checkout_url
    });

  } catch (error: any) {
    // Log the actual error from Chapa for debugging
    console.error("Chapa Initialization Failed:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.message || "Payment service unavailable" 
    });
  }
};