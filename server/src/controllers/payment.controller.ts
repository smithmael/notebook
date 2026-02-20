import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../lib/prisma.js';

export const initializePayment = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.body;
    const userId = Number(req.user?.id);

    const [book, user] = await Promise.all([
      prisma.book.findUnique({ where: { id: Number(bookId) } }),
      prisma.user.findUnique({ where: { id: userId } })
    ]);

    // 1. Safety Check: Ensure everything exists
    if (!book || !user || !user.email) {
      return res.status(400).json({ status: 'fail', message: "User email or book missing" });
    }

    // 2. Fix 'user.name' possibly null error [cite: 2026-02-08]
    const fullName = user.name ?? "Guest User"; 
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : "User";

    const cleanEmail = String(user.email).trim().toLowerCase();
    const tx_ref = `tx-${userId}-${bookId}-${Date.now()}`;

    // 3. Fix 'CHAPA_SECRET_KEY' possibly undefined error
    const secretKey = (process.env.CHAPA_SECRET_KEY ?? '').trim();

    if (!secretKey) {
      throw new Error("CHAPA_SECRET_KEY is missing in .env");
    }

    const chapaPayload = {
      amount: String(book.rentPrice),
      currency: "ETB",
      email: cleanEmail,
      first_name: firstName,
      last_name: lastName,
      tx_ref: tx_ref,
      callback_url: `${process.env.BACKEND_URL}/api/payments/verify/${tx_ref}`,
      return_url: `${process.env.FRONTEND_URL}/user/bookshelf`,
      "customization[title]": `Book Rental: ${book.title}`,
      "customization[description]": "Payment for book rental"
    };

    console.log("🚀 Payload ready for Chapa:", { email: cleanEmail, tx_ref });

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      chapaPayload,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.status === "success") {
      return res.status(200).json({ 
        status: 'success', 
        checkout_url: response.data.data.checkout_url 
      });
    }

  } catch (error: any) {
    const chapaError = error.response?.data;
    console.error("🔥 Chapa API Error:", JSON.stringify(chapaError, null, 2));

    res.status(500).json({ 
      status: 'error', 
      message: "Payment Gateway Error",
      details: chapaError || error.message 
    });
  }
};