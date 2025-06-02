import { Request, Response } from "express";

// Make sure to export a named function (not default)
export const get = (req: Request, res: Response): void => {
    res.status(200).json({ message: "Chat route working ✅" });
};
