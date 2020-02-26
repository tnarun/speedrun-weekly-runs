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

const outputOSS = async (fname, data) => {
  let fileKey = `speedrun-weekly-leaderboard-runs-data/${fname}`
  await ossClient.put(fileKey, new Buffer(data))
}

const run = async () => {
  let res = await fetch(`https://www.speedrun.com/ajax_latestleaderboard.php?amount=1000`)
  let html = await res.text()

  let now = new Date()
  let m = moment(now).utcOffset(8)
  let time = m.format('YYYY-MM-DD-HH-mm-ss')
  let date = m.format('YYYY-MM-DD')

  try {
    await outputOSS(`${date}/latestleaderboard-${time}.html`, html)
  } catch (e) {}

  try {
    let data = parseHTML(html)
    let jsondata = JSON.stringify(data, null, 2)
    await outputOSS(`${date}/latestleaderboard-${time}.json`, jsondata)
    await outputOSS(`latestleaderboard-newest.json`, jsondata)
  } catch (e) {}
}

module.exports.handler = (event, context, callback) => {
  run().then(res => {
    callback(null, res)
  })
}