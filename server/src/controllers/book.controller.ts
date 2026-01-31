// src/controllers/book.controller.ts
import { Request, Response } from 'express'
import * as bookService from '../services/book.service'

// Define the UserRole type
type UserRole = "USER" | "ADMIN" | "OWNER"

export const uploadBook = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' })
    }

    const ownerId = Number(req.user.id)
    const book = await bookService.createBook(req.body, ownerId)
    
    if (!book) {
      return res.status(404).json({ status: 'fail', message: 'Book not found' })
    }
    
    res.status(201).json({ status: 'success', data: book })
  } catch (e: any) {
    res.status(400).json({ status: 'fail', message: e.message || 'Upload failed' })
  }
}

export const getMyBooks = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' })
    }

    const result = await bookService.getBooks({ ownerId: Number(req.user.id) })
    res.json({ status: 'success', data: result })
  } catch (e: any) {
    res.status(400).json({ status: 'fail', message: e.message || 'Fetch failed' })
  }
}

export const updateBook = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const parsedId = parseInt(id)

  if (isNaN(parsedId)) {
    return res.status(400).json({ status: 'fail', message: 'Invalid Book ID' })
  }

  try {
    const book = await bookService.updateBook(parsedId, req.body)
    if (!book) {
      return res.status(404).json({ status: 'fail', message: 'Book not found' })
    }
    
    res.json({ status: 'success', data: book })
  } catch (e: any) {
    res.status(404).json({ status: 'fail', message: e.message || 'Update failed' })
  }
}

export const deleteBook = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const parsedId = parseInt(id)

  if (isNaN(parsedId)) {
    return res.status(400).json({ status: 'fail', message: 'Invalid Book ID' })
  }

  try {
    await bookService.deleteBook(parsedId)
    res.status(204).send()
  } catch (e: any) {
    res.status(404).json({ status: 'fail', message: e.message || 'Delete failed' })
  }
}