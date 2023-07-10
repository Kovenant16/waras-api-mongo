import express from "express";

import { agregarLocal } from "../controllers/localController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", checkAuth, agregarLocal);

export default router;
