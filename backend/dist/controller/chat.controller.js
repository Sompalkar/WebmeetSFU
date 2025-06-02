"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
// Make sure to export a named function (not default)
const get = (req, res) => {
    res.status(200).json({ message: "Chat route working ✅" });
};
exports.get = get;
