import 'dotenv/config'
import app from './src/config/app';  
import { ENV } from './src/config/env';

const PORT = ENV.PORT
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})