require('./env')

const fetch = require('node-fetch')
const parseHTML = require('./lib/parse-leaderboard-html')
const moment = require('moment')

const OSS = require('ali-oss')
const ossClient = new OSS({
  "region": process.env.SIBBAY_OSS_REGION,
  "bucket": process.env.SIBBAY_OSS_WEB_TUI_BUCKET_NAME,
  "accessKeyId": process.env.SIBBAY_OSS_ACCESS_KEY_ID,
  "accessKeySecret": process.env.SIBBAY_OSS_ACCESS_KEY_SECRET
})

const output = async (fname, data) => {
  let fileKey = `speedrun-weekly-leaderboard-runs-data/${fname}`
  await ossClient.put(fileKey, new Buffer(data))
}

const run = async () => {
  let res = await fetch(`https://www.speedrun.com/ajax_latestleaderboard.php?amount=1000`)
  let html = await res.text()

  let now = new Date()
  let stamp = now.getTime()
  let time = moment(now).utcOffset(8).format('YYYY-MM-DD-HH-mm-ss')

  try {
    await output(`latestleaderboard-${time}-${stamp}.html`, html)
  } catch (e) {}

  try {
    let data = parseHTML(html)
    await output(`latestleaderboard-${time}-${stamp}.json`, 
      JSON.stringify(data, null, 2))
  } catch (e) {}
}

module.exports.handler = (event, context, callback) => {
  run().then(res => {
    callback(null, res)
  })
}