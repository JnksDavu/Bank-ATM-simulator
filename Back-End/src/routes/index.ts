import { Router } from "express";
import userController from "../controller/userController";

const router = Router();

router.get("/users", userController.getUsers);

export default router;
