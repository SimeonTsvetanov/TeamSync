// generate-icons.js
// Usage: node generate-icons.js
// Requires: npm install sharp

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "TeamSyncIcon.png");
const targets = [
  { name: "TeamSyncIcon-512.png", size: 512 },
  { name: "TeamSyncIcon-384.png", size: 384 },
  { name: "TeamSyncIcon-256.png", size: 256 },
  { name: "TeamSyncIcon-192.png", size: 192 },
  { name: "TeamSyncIcon-144.png", size: 144 },
  { name: "TeamSyncIcon-72.png", size: 72 },
  { name: "favicon-32.png", size: 32 },
];

(async () => {
  if (!fs.existsSync(source)) {
    console.error("Source icon TeamSyncIcon.png not found!");
    process.exit(1);
  }
  for (const t of targets) {
    await sharp(source)
      .resize(t.size, t.size)
      .toFile(path.join(__dirname, t.name));
    console.log(`Generated ${t.name}`);
  }
  // Generate favicon.ico (contains 32x32)
  await sharp(source)
    .resize(32, 32)
    .toFile(path.join(__dirname, "favicon.ico"));
  console.log("Generated favicon.ico");
})();
