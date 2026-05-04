---
description: Step-by-step workflow for scaffolding a new module (e.g., Product, Category, Order)
---

// turbo-all

# Create New Module

This workflow creates a complete module following the project's layered architecture.
Replace `X` / `x` with the module name (e.g., `Product` / `product`).

**Dependency flow (NEVER violate):**
```
Router → Controller → Service → Repository → Model
```

---

## Steps

### 1. Create Model — `src/models/x.model.js`

Define the Mongoose schema:

```js
"use strict"

import mongoose from "mongoose";

const XSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    // add fields...
  },
  {
    timestamps: true,
    collection: "xs",   // explicit collection name, always lowercase plural
  },
);

// Indexes based on anticipated query patterns
XSchema.index({ name: 1 });

export default mongoose.model("X", XSchema);
```

**Rules:**
- Always `timestamps: true` and explicit `collection` name
- `enum` must list ALL values used anywhere in the codebase
- Indexes based on actual query patterns in Repository
- Sensitive fields (e.g., password) — do NOT use `select: false`; strip in Service layer instead

---

### 2. Create Repository — `src/repositories/x.repository.js`

```js
"use strict"

import X from "../models/x.model.js";
import buildFindQueryOptions from "../utils/queryOptions.js";

class XRepository {
  async create(data) {
    return await X.create(data);
  }

  async findById(id) {
    return await X.findById(id);
  }

  async findAll({ filters, sort = { createdAt: -1 }, paginator } = {}) {
    return await X.find(
      ...buildFindQueryOptions({ filters, sort, paginator })
    );
  }

  async update(id, data) {
    return await X.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await X.findByIdAndDelete(id);
  }
}

export default new XRepository();
```

**Rules:**
- Only layer allowed to import Model
- Return raw Mongoose documents — do NOT throw errors here
- Use `buildFindQueryOptions()` for list queries with filter/sort/paginate

---

### 3. Create Service — `src/services/x.service.js`

```js
"use strict"

import { BAD_REQUEST, NOT_FOUND, CONFLICT } from "../utils/response.js";
import xRepository from "../repositories/x.repository.js";

class XService {
  async getById(id) {
    const doc = await xRepository.findById(id);
    if (!doc) throw new NOT_FOUND({ message: "X not found" });
    return doc;
  }

  async getAll(query) {
    return await xRepository.findAll(query);
  }

  async create(data) {
    // business validation example
    const existing = await xRepository.findByName(data.name);
    if (existing) throw new CONFLICT({ message: "X already exists" });

    return await xRepository.create(data);
  }

  async update(id, data) {
    const doc = await xRepository.findById(id);
    if (!doc) throw new NOT_FOUND({ message: "X not found" });

    return await xRepository.update(id, data);
  }

  async delete(id) {
    const doc = await xRepository.findById(id);
    if (!doc) throw new NOT_FOUND({ message: "X not found" });

    return await xRepository.delete(id);
  }
}

export default new XService();
```

**Rules:**
- Import Repository only — NEVER import Model directly
- Throw `ErrorResponse` subclasses for ALL failure cases — NEVER return `null`/`false`
- Strip sensitive fields before returning: `.toObject()` + `delete`
- `try...catch` allowed ONLY for wrapping external library errors (JWT, bcrypt)

---

### 4. Create Controller — `src/controllers/x.controller.js`

```js
"use strict"

import xService from "../services/x.service.js";
import { OK, CREATED } from "../utils/response.js";

class XController {
  async getById(req, res) {
    const result = await xService.getById(req.params.id);
    new OK({ message: "Retrieved successfully", data: result }).send(res);
  }

  async getAll(req, res) {
    const result = await xService.getAll(req.query);
    new OK({ message: "Retrieved successfully", data: result }).send(res);
  }

  async create(req, res) {
    const result = await xService.create(req.body);
    new CREATED({ message: "Created successfully", data: result }).send(res);
  }

  async update(req, res) {
    const result = await xService.update(req.params.id, req.body);
    new OK({ message: "Updated successfully", data: result }).send(res);
  }

  async delete(req, res) {
    await xService.delete(req.params.id);
    new OK({ message: "Deleted successfully" }).send(res);
  }
}

export default new XController();
```

**Rules:**
- Import Service only — NEVER import Repository or Model
- NO `try...catch` — errors propagate via `asyncHandler` → `errorHandler`
- NO business logic — only extract req data, call Service, send response
- Response MUST use `new OK/CREATED().send(res)`, never `res.status().json()`

---

### 5. Create Validation — `src/validations/x.validation.js`

```js
"use strict"

import Joi from "joi";

const create = {
  body: Joi.object({
    name: Joi.string().required(),
    status: Joi.string().valid("active", "inactive").optional(),
  }),
};

const update = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(), // MongoDB ObjectId
  }),
  body: Joi.object({
    name: Joi.string().optional(),
    status: Joi.string().valid("active", "inactive").optional(),
  }),
};

const getById = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

export default { create, update, getById };
```

---

### 6. Create Route — `src/routes/x.route.js`

```js
"use strict"

import express from "express";
import asyncHandler from "express-async-handler";
import xController from "../controllers/x.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import xValidation from "../validations/x.validation.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", asyncHandler(xController.getAll));
router.get("/:id", validate(xValidation.getById), asyncHandler(xController.getById));
router.post("/", verifyToken, validate(xValidation.create), asyncHandler(xController.create));
router.patch("/:id", verifyToken, validate(xValidation.update), asyncHandler(xController.update));
router.delete("/:id", verifyToken, asyncHandler(xController.delete));

export default router;
```

**Middleware chain order:** `[Auth] → [Rate Limit] → [Validate] → [Upload] → asyncHandler(controller.method)`

---

### 7. Register Route — `src/routes/index.js`

```js
import xRoutes from "./x.route.js";
router.use("/x", xRoutes);
```

---

### 8. Verify

- [ ] Import flow: Router → Controller → Service → Repository → Model (no violations)
- [ ] `"use strict"` on line 1 of every new file
- [ ] No `console.log` — use `logger`
- [ ] No `res.status().json()` — use response classes
- [ ] No `try...catch` in Controller
- [ ] All async handlers wrapped with `asyncHandler()`
- [ ] Joi enum values match Model enum values exactly
- [ ] Route registered in `src/routes/index.js`
- [ ] Run `security-review` workflow after scaffold is complete
