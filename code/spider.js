require('./env')

const fetch = require('node-fetch')
const moment = require('moment')
const parseHTML = require('./lib/parse-leaderboard-html')
const outputOSS = require('./lib/outputOSS')

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
    console.log('uploaded.')
  } catch (e) {}
}

module.exports.handler = (event, context, callback) => {
  run().then(res => {
    callback(null, res)
  })
}