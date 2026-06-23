import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import contactRoutes from './routes/contact.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import { ensureProjectCmsSchema } from './config/schema.js';
import { createCorsOptions } from './config/cors.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors(createCorsOptions()));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

app.use(errorHandler);

const startServer = async () => {
  await ensureProjectCmsSchema();

  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Impossible de démarrer le serveur :", error);
  process.exit(1);
});
