import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`[Server] MIZAN backend listening on port ${PORT}`);
  });
};

startServer();
