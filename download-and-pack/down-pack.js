const readHTML = require('./lib/readHTML')
const packHTML = require('./lib/packHTML')
const ossClient = require('./lib/ossClient')

// 检查命令行参数
const DATE = process.argv[2]
if (!DATE) {
  console.log(`usage: node down-pack.js 2020-xx-xx`)
  process.exit(0)
}
console.log(`DATE: ${DATE}`)

const run = async () => {
  let htmlContents = await readHTML({ DATE })
  let outputData = await packHTML({ DATE, htmlContents })

  let fileKey = `speedrun-weekly-leaderboard-runs-data/packs/${DATE}-pack.json`
  await ossClient.put(fileKey, Buffer.from(JSON.stringify(outputData, null, 2)))
}

run().then()
