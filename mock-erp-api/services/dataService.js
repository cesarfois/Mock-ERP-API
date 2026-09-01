const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

const initDB = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ lastSequence: 0, suppliers: [] }, null, 2));
  }
};

const readDB = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    // Migration for old files that didn't have lastSequence
    if (parsed.lastSequence === undefined) {
      let maxNum = 0;
      for (const supplier of (parsed.suppliers || [])) {
        if (supplier.erpCode && supplier.erpCode.startsWith('C')) {
          const num = parseInt(supplier.erpCode.substring(1), 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      }
      parsed.lastSequence = maxNum;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading database:', error);
    return { lastSequence: 0, suppliers: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to database:', error);
  }
};

const generateSupplierCode = (db) => {
  const nextNum = (db.lastSequence || 0) + 1;
  const padded = nextNum.toString().padStart(3, '0');
  db.lastSequence = nextNum; // The controller is responsible for calling writeDB(db) afterwards
  return `C${padded}`;
};

const clearSuppliers = () => {
  const db = readDB();
  db.suppliers = [];
  writeDB(db);
};

const resetEnvironment = () => {
  writeDB({ lastSequence: 0, suppliers: [] });
};

module.exports = {
  initDB,
  readDB,
  writeDB,
  generateSupplierCode,
  clearSuppliers,
  resetEnvironment
};
