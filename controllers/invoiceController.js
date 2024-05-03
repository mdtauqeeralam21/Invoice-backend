import Invoice from "../models/invoice.js";

const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, raisingFromCompany, raisingToCompany, services } =
      req.body;
    req.body.createdBy = req.user.userId;
    const newInvoice = new Invoice({
      raisingFromCompany,
      raisingToCompany,
      services,
      invoiceNumber,
      createdBy: req.body.createdBy,
    });
    await newInvoice.save();
    res
      .status(201)
      .json({ message: "Invoice created successfully", invoiceNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllInvoicesForAdmin = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const queryObject = {
      createdBy: req.user.userId,
    };
    const invoices = await Invoice.find(queryObject).sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getInvoiceByNumber = async (req, res) => {
  try {
    const invoiceNumber = req.params.invoiceNumber;
    const invoice = await Invoice.findOne({ invoiceNumber });
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateInvoiceServices = async (req, res) => {
  try {
    const invoiceNumber = req.params.invoiceNumber;
    const { services } = req.body;
    const invoice = await Invoice.findOne({ invoiceNumber });
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    invoice.services = services;
    await invoice.save();
    res.status(200).json({ message: "Invoice services updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const deleteInvoice = async (req, res) => {
  try {
    const invoiceNumber = req.params.invoiceNumber;
    
    const invoice = await Invoice.findOne({ invoiceNumber });
    
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    await Invoice.deleteOne({ invoiceNumber });
    
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  createInvoice,
  getAllInvoices,
  getInvoiceByNumber,
  updateInvoiceServices,
  deleteInvoice,
  getAllInvoicesForAdmin,
};

