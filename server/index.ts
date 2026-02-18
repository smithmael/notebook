// server/index.ts
import { ENV } from './src/config/env'; // Load this FIRST - it handles the path logic
import app from './src/config/app';     

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔗 CORS Origin: ${ENV.CORS_ORIGIN}`);
});