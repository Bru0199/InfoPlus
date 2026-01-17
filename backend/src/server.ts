import app from './app';
import { env } from './env';

const port = env.PORT;

app.listen(port, () => {
  console.log(`
  🚀 Server is running!
  📡 Mode: ${env.NODE_ENV}
  🔗 URL: http://localhost:${port}
  `);
});