"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("../controllers/bookController");
const router = (0, express_1.Router)();
router.get("/", bookController_1.getBooks);
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, bookController_1.getBookById)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.post("/", bookController_1.createBook);
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, bookController_1.updatebook)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, bookController_1.deleteBook)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
