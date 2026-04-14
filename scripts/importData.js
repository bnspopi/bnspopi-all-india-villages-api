const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function parseCsvFiles() {
  const dataFolder = path.join(__dirname, "../data");
  const files = fs.readdirSync(dataFolder).filter(f => f.endsWith(".csv"));

  let villages = [];

  for (let file of files) {
    const filePath = path.join(dataFolder, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    for (let line of lines) {
      const values = line.split(",");
      if (values.length < 8) continue;

      const village = {
        state: values[1]?.trim(),
        district: values[3]?.trim(),
        name: values[7]?.trim(),
        population: 0,
      };

      if (village.state && village.district && village.name) {
        villages.push(village);
      }
    }
    console.log(`Parsed ${file}: ${lines.length - 1} lines`);
  }

  return villages;
}

async function insertWithRetry(batch, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.village.createMany({
        data: batch,
        skipDuplicates: true,
      });
      return true;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.log(`Attempt ${attempt} failed, retrying in 2s...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function main() {
  try {
    console.log("🔍 Parsing CSV files...");
    const villages = await parseCsvFiles();
    console.log(`✅ Total villages parsed: ${villages.length}`);

    // Check if villages already exist
    const existing = await prisma.village.count();
    if (existing > 0) {
      console.log(`⚠️  Database already has ${existing} villages. Skipping import.`);
      return;
    }

    console.log("\n📤 Importing villages in batches...");
    const batchSize = 500; // Reduced batch size for stability

    for (let i = 0; i < villages.length; i += batchSize) {
      const batch = villages.slice(i, i + batchSize);
      await insertWithRetry(batch);
      console.log(`✅ Inserted ${Math.min(i + batch.length, villages.length)} / ${villages.length}`);
    }

    console.log("\n✨ ALL DATA IMPORTED SUCCESSFULLY!");
    const total = await prisma.village.count();
    console.log(`📊 Total villages in database: ${total}`);
  } catch (error) {
    console.error("❌ Import failed:", error.message);
    process.exit(1);
  }
}

main().finally(() => prisma.$disconnect());
