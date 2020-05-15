require('./env')

const moment = require('moment')

const readHTML = require('./lib/readHTML')
const packHTML = require('./lib/packHTML')
const ossClient = require('./lib/ossClient')

const downPack = async ({ DATE }) => {
  let htmlContents = await readHTML({ DATE })
  let outputData = await packHTML({ DATE, htmlContents })

  let fileKey = `speedrun-weekly-leaderboard-runs-data/packs/${DATE}-pack.json`
  await ossClient.put(fileKey, Buffer.from(JSON.stringify(outputData, null, 2)))
}

const run = async () => {
  let DATE = moment().add(-13, 'hour').format('YYYY-MM-DD')
  await downPack({ DATE })
}

module.exports.handler = (event, context, callback) => {
  run().then(res => {
    callback(null, res)
  })
}