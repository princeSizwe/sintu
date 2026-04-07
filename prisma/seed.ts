import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const zulu = await prisma.language.upsert({
    where: { code: "zu" },
    update: {},
    create: { name: "Zulu", code: "zu" },
  });
  const sotho = await prisma.language.upsert({
    where: { code: "st" },
    update: {},
    create: { name: "Sotho", code: "st" },
  });
  const xhosa = await prisma.language.upsert({
    where: { code: "xh" },
    update: {},
    create: { name: "Xhosa", code: "xh" },
  });

  const moya = await prisma.entry.upsert({
    where: { word_languageId: { word: "moya", languageId: zulu.id } },
    update: {},
    create: {
      word: "moya",
      definition: "spirit / wind / air",
      languageId: zulu.id,
    },
  });

  for (const [form, meaning] of [
    ["hla", "to climb / ascend"],
    ["hle", "beautiful / please (softener)"],
    ["hli", "to flash / glint"],
    ["hlo", "to watch / observe"],
    ["hlu", "to overcome / surpass"],
  ]) {
    await prisma.entry.upsert({
      where: { word_languageId: { word: form, languageId: zulu.id } },
      update: {},
      create: { word: form, definition: meaning, languageId: zulu.id },
    });
  }

  await prisma.morpheme.upsert({
    where: { id: "morpheme-mo" },
    update: {},
    create: { id: "morpheme-mo", form: "mo", meaning: "singular noun prefix (class 3)", entryId: moya.id },
  });
  await prisma.morpheme.upsert({
    where: { id: "morpheme-ya" },
    update: {},
    create: { id: "morpheme-ya", form: "ya", meaning: "connective / movement marker", entryId: moya.id },
  });

  await prisma.entry.upsert({
    where: { word_languageId: { word: "motho", languageId: sotho.id } },
    update: {},
    create: { word: "motho", definition: "person / human being", languageId: sotho.id },
  });

  await prisma.entry.upsert({
    where: { word_languageId: { word: "ubuntu", languageId: xhosa.id } },
    update: {},
    create: { word: "ubuntu", definition: "humanity / human kindness", languageId: xhosa.id },
  });

  console.log("Seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
