import { Request, Response } from "express";

const getUsers = (req: Request, res: Response) => {
  res.json([{ id: 1, name: "Usuário Exemplo" }]);
};

export default { getUsers };
