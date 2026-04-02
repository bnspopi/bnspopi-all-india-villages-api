const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const dataFolder = path.join(__dirname, "../data");
  const files = fs.readdirSync(dataFolder);

  let villages = [];

  for (let file of files) {
    if (!file.endsWith(".csv")) continue;

    const filePath = path.join(dataFolder, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const lines = content.split("\n");

    for (let line of lines) {
      const values = line.split(",");

      if (values.length < 8) continue;

      villages.push({
        state: values[1]?.trim(),
        district: values[3]?.trim(),
        name: values[7]?.trim(),
        population: 0,
      });
    }
  }

  console.log("Total villages:", villages.length);

  const batchSize = 1000;

  for (let i = 0; i < villages.length; i += batchSize) {
    const batch = villages.slice(i, i + batchSize);

    await prisma.village.createMany({
      data: batch,
      skipDuplicates: true,
    });

    console.log(`Inserted ${i + batch.length}`);
  }

  console.log("✅ ALL DATA INSERTED");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
