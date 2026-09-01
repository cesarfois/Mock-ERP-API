const dataService = require('../services/dataService');

exports.createSupplier = (req, res) => {
  try {
    const data = req.body;
    
    // Validations
    if (!data.nif) {
      return res.status(400).json({ success: false, message: 'NIF is required' });
    }
    if (!data.name && !data.fiscalName) {
      return res.status(400).json({ success: false, message: 'Name (name or fiscalName) is required' });
    }

    const db = dataService.readDB();
    
    // Check duplicate NIF
    const existingSupplier = db.suppliers.find(s => s.nif === data.nif);
    if (existingSupplier) {
      return res.status(409).json({
        success: false,
        message: 'Supplier already exists',
        supplierCode: existingSupplier.erpCode || existingSupplier.code
      });
    }

    // Generate new code
    const erpCode = dataService.generateSupplierCode(db.suppliers);
    
    // Build supplier object
    const newSupplier = {
      ...data,
      name: data.name || data.fiscalName, // Fallback if they use fiscalName
      erpCode: erpCode,
      code: erpCode, // Kept for compatibility with both examples in the prompt
      status: 'Cadastrado',
      createdAt: new Date().toISOString()
    };

    // Save
    db.suppliers.push(newSupplier);
    dataService.writeDB(db);

    return res.status(201).json({
      success: true,
      message: 'Fornecedor cadastrado com sucesso',
      supplier: newSupplier
    });

  } catch (error) {
    console.error('Error creating supplier:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getSuppliers = (req, res) => {
  try {
    const db = dataService.readDB();
    return res.status(200).json({
      success: true,
      total: db.suppliers.length,
      suppliers: db.suppliers
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getSupplierByCode = (req, res) => {
  try {
    const { code } = req.params;
    const db = dataService.readDB();
    
    const supplier = db.suppliers.find(s => s.erpCode === code || s.code === code);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    return res.status(200).json({
      success: true,
      supplier
    });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
