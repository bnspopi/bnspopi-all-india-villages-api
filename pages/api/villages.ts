import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { state, search = '', page = '1', limit = '20' } = req.query as {
        state?: string;
        search?: string;
        page?: string;
        limit?: string;
      };

      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 20;

      const where: Record<string, unknown> = {};

      if (state && state !== 'All states') {
        where.state = state;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { district: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [villages, total] = await Promise.all([
        prisma.village.findMany({
          where,
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        prisma.village.count({ where }),
      ]);

      console.log('Fetched villages:', villages.length, 'Total:', total);
      return res.status(200).json({
        data: villages,
        total,
        page: pageNumber,
        limit: limitNumber,
      });
    }

    if (req.method === 'POST') {
      const { name, district, state, population } = req.body;

      if (!name || !district || !state || !population) {
        return res.status(400).json({ error: 'Missing required village fields.' });
      }

      const created = await prisma.village.create({
        data: {
          name: String(name).trim(),
          district: String(district).trim(),
          state: String(state).trim(),
          population: Number(population),
        },
      });

      return res.status(201).json(created);
    }

    if (req.method === 'PUT') {
      const { id, name, district, state, population } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Village id is required.' });
      }

      const updated = await prisma.village.update({
        where: { id: String(id) },
        data: {
          name: name ? String(name).trim() : undefined,
          district: district ? String(district).trim() : undefined,
          state: state ? String(state).trim() : undefined,
          population: population ? Number(population) : undefined,
        },
      });

      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Village id is required.' });
      }

      await prisma.village.delete({ where: { id: String(id) } });
      return res.status(200).json({ id, deleted: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error while processing village request.' });
  }
}
