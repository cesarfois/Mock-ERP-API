const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory and file exist
const initDB = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ suppliers: [] }, null, 2));
  }
};

const readDB = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { suppliers: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to database:', error);
  }
};

const generateSupplierCode = (suppliers) => {
  if (!suppliers || suppliers.length === 0) {
    return 'C001';
  }
  // Find the highest number in existing codes
  let maxNum = 0;
  for (const supplier of suppliers) {
    if (supplier.erpCode && supplier.erpCode.startsWith('C')) {
      const numStr = supplier.erpCode.substring(1);
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  
  const nextNum = maxNum + 1;
  // Pad with leading zeros to at least 3 digits
  const padded = nextNum.toString().padStart(3, '0');
  return `C${padded}`;
};

module.exports = {
  initDB,
  readDB,
  writeDB,
  generateSupplierCode
};
