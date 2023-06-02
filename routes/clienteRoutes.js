import express from "express";

import { agregarCliente } from "../controllers/clienteController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/", checkAuth, agregarCliente);

export default router;
