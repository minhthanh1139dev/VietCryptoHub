"use strict"

import express from "express";
import userRoutes from "./user.route.js";
import fileRoutes from "./file.route.js";
import adminFileRoutes from "./adminFile.route.js";
import cryptoRoutes from "./crypto.route.js";

const router = express.Router();

router.use("/auth", userRoutes);
router.use("/admin/files", adminFileRoutes);
router.use("/files", fileRoutes);
router.use("/crypto", cryptoRoutes);

export default router;

