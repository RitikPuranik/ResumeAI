import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from the correct path BEFORE anything else
dotenv.config({ path: path.join(__dirname, '.env') })

// Now import the rest
import app from './src/app.js'
import connectDB from './src/config/db.js'
import { seedCouponsFromEnv } from './src/modules/coupon/coupon.service.js'

const PORT = process.env.PORT || 5000

connectDB().then(async () => {
  // Seed coupons from COUPON_* env vars
  await seedCouponsFromEnv()

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)

    // Keep-alive: ping self every 4 minutes to prevent Render free tier from sleeping
    const backendUrl = process.env.BACKEND_URL;
    if (backendUrl && process.env.NODE_ENV === 'production') {
      const PING_INTERVAL = 4 * 60 * 1000; // 4 minutes
      setInterval(async () => {
        try {
          const pingUrl = backendUrl.endsWith('/') ? `${backendUrl}health` : `${backendUrl}/health`;
          const res = await fetch(pingUrl);
          console.log(`🏓 Keep-alive ping: ${res.status}`);
        } catch (err) {
          console.warn('⚠️  Keep-alive ping failed:', err.message);
        }
      }, PING_INTERVAL);
      console.log(`✅ Keep-alive started: pinging ${backendUrl} every 4 minutes`);
    }
  })
})