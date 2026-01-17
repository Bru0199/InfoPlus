import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check to test the server
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

export default app;