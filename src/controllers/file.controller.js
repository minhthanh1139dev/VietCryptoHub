"use strict"

import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { CREATED, OK, BAD_REQUEST } from "../utils/response.js";
import fileService from "../services/file.service.js";

class FileController {
  async getAllFiles(req, res) {
    const files = await fileService.getAllFiles();

    new OK({
      message: "Files retrieved successfully",
      data: files.map((fileDoc) => ({
        id: fileDoc._id,
        originalName: fileDoc.originalName,
        storageKey: fileDoc.storageKey,
        url: `/api/v1/files/${fileDoc._id}`,
        mime: fileDoc.mime,
        size: fileDoc.size,
        kind: fileDoc.kind,
        isPublic: fileDoc.isPublic,
        createdAt: fileDoc.createdAt,
      })),
    }).send(res);
  }

  async _getFileByKind(req, res, expectedKind) {
    const { id } = req.params;
    const fileDoc = await fileService.getPublicFileById(id);

    if (expectedKind && fileDoc.kind !== expectedKind) {
      throw new BAD_REQUEST({ message: "File type mismatch for this endpoint" });
    }

    const filePath = path.join(process.cwd(), "uploads", fileDoc.storageKey);
    res.setHeader("Content-Type", fileDoc.mime || "application/octet-stream");
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    await pipeline(fs.createReadStream(filePath), res);
  }

  async getImage(req, res) {
    await this._getFileByKind(req, res, "image");
  }

  async getDocument(req, res) {
    await this._getFileByKind(req, res, "document");
  }

  async getVideo(req, res) {
    await this._getFileByKind(req, res, "video");
  }

  async getFile(req, res) {
    await this._getFileByKind(req, res, null);
  }

  async uploadFile(req, res) {
    const fileDoc = await fileService.uploadFile(req.file);

    new CREATED({
      message: "File uploaded successfully",
      data: {
        id: fileDoc._id,
        originalName: fileDoc.originalName,
        storageKey: fileDoc.storageKey,
        url: `/api/v1/files/${fileDoc._id}`,
        mime: fileDoc.mime,
        size: fileDoc.size,
        kind: fileDoc.kind,
        isPublic: fileDoc.isPublic,
        createdAt: fileDoc.createdAt,
      },
    }).send(res);
  }

  async deleteFile(req, res) {
    await fileService.deleteFile(req.params.id);
    new OK({ message: "File deleted successfully" }).send(res);
  }
}

export default new FileController();
