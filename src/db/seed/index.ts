import { seedCompetition } from "./seasons-seed";

seedCompetition()
  .then(() => {
    console.log("✅ Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  });