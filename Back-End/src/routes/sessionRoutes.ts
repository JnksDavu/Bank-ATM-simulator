import { Router, Request, Response } from "express";
import { createSession, getSessionKeyMap,validateSession } from "../controller/sessions";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  await createSession(req, res);
});

router.get("/:sessionId/keymap", async (req: Request, res: Response) => {
  await getSessionKeyMap(req, res);
});

router.post("/:sessionId/validate", async (req: Request, res: Response) => {
    await validateSession(req, res);
  });
  

export default router;