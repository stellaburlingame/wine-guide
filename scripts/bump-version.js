import fs from "fs";

const filePath = "./src/version.js";

// Get today's date
const now = new Date();
const yy = String(now.getFullYear()).slice(2);
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");

// Read current version
const file = fs.readFileSync(filePath, "utf8");
const match = file.match(/"(\d{2}\.\d{2}\.\d{2}\.\d{2})"/);

let counter = "01";

if (match) {
    const [, oldVersion] = match;
    const [oldYY, oldMM, oldDD, oldCounter] = oldVersion.split(".");

  // If same day, increment counter
    if (oldYY === yy && oldMM === mm && oldDD === dd) {
        counter = String(Number(oldCounter) + 1).padStart(2, "0");
    }
}

const newVersion = `${yy}.${mm}.${dd}.${counter}`;

// Replace version
const updated = file.replace(/"(\d{2}\.\d{2}\.\d{2}\.\d{2})"/, `"${newVersion}"`);
fs.writeFileSync(filePath, updated);

console.log(`Version bumped → ${newVersion}`);