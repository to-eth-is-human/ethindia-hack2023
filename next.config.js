// next.config.js
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    
  }

  const nextConfig = {
    // config options here...
  }
  return nextConfig
}
