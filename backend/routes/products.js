import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const router = express.Router();

// 1. GET all products (Supports Polling)
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 2. Toggle Publish Status Endpoint
router.put('/:id/toggle-publish', async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isPublished: !product.isPublished },
    });

    // Emit the update via WebSocket
    if (req.io) {
      req.io.emit('productUpdated', updatedProduct);
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error toggling publish status:', error);
    res.status(500).json({ error: 'Failed to toggle product status' });
  }
});

// 3. Seed Products from DummyJSON
router.post('/seed', async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=50');
    const data = await response.json();
    
    // Map DummyJSON structure to our Prisma schema
    const productsToInsert = data.products.map((p) => ({
      title: p.title,
      description: p.description,
      price: p.price,
      thumbnail: p.thumbnail,
      category: p.category,
      stock: p.stock,
      rating: p.rating,
      isPublished: true, 
    }));

    await prisma.product.createMany({
      data: productsToInsert,
      skipDuplicates: true, // Safety check
    });

    res.json({ message: 'Products seeded successfully into database!' });
  } catch (error) {
    console.error('Seed products error:', error);
    res.status(500).json({ error: 'Failed to seed products' });
  }
});

export default router;
