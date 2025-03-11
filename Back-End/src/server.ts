import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import routes from "./routes";
import routerAuth from "./routes/auth"
import {setupDatabase} from "./utils/database"

setupDatabase();

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

//app.use("/api/auth", routerAuth);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
