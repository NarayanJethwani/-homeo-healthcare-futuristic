"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repertoryRepository = void 0;
const MemoryRepertoryRepository_1 = require("../repositories/MemoryRepertoryRepository");
// Create a single global instance of our repository (using the in-memory version for Phase 1 safety)
exports.repertoryRepository = new MemoryRepertoryRepository_1.MemoryRepertoryRepository();
exports.default = exports.repertoryRepository;
