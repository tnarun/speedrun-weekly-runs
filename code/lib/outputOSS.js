const ossClient = require('./ossClient')

const outputOSS = async (fname, data) => {
  let fileKey = `speedrun-weekly-leaderboard-runs-data/${fname}`
  await ossClient.put(fileKey, Buffer.from(data))
}

module.exports = outputOSS