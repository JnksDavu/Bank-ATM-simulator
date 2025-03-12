import { Router, Request, Response } from "express";
import { createUser, checkUserExists } from "../controller/userController";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  await createUser(req, res);
});

router.get("/check/:username", async (req: Request, res: Response) => {
  await checkUserExists(req, res);
});

export default router;