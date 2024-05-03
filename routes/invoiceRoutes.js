import express from "express";
const router = express.Router();

import {
  createInvoice,
  getAllInvoices,
  getInvoiceByNumber,
  updateInvoiceServices,
  deleteInvoice,
  getAllInvoicesForAdmin
} from "../controllers/invoiceController.js";

router.route("/").post(createInvoice).get(getAllInvoices);
router.route("/:invoiceNumber").get(getInvoiceByNumber).put(updateInvoiceServices).delete(deleteInvoice);
//router.route("/admin").get(getAllInvoicesForAdmin);
export default router;
