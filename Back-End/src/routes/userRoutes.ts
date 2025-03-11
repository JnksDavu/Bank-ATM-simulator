import { Router, Request, Response } from "express";
import { createUser } from "../controller/userController";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  await createUser(req, res);
});

export default router;