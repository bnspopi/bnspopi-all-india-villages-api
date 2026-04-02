import fs from 'fs/promises';
import path from 'path';
import prisma from '../lib/prisma';

async function parseCsv(csv: string) {
  const lines = csv.trim().split(/\r?\n/);
  const [header, ...rows] = lines;
  return rows.map((line) => {
    const [name, district, state, population] = line.split(',').map((value) => value.trim());
    return {
      name,
      district,
      state,
      population: Number(population || 0),
    };
  });
}

async function main() {
  const csvPath = path.join(process.cwd(), 'prisma', 'villages.csv');
  const rawCsv = await fs.readFile(csvPath, 'utf8');
  const villages = await parseCsv(rawCsv);

  console.log(`Seeding ${villages.length} villages...`);

  await prisma.village.deleteMany();
  await prisma.village.createMany({
    data: villages,
    skipDuplicates: true,
  });

  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
