require('./env')

const Parser = require('./lib/parseActivePlayersGames')
const outputOSS = require('./lib/outputOSS')
const moment = require('moment')

// 定时抓取热度前 100 的游戏
const run = async () => {
  let p = new Parser()
  let games = await p.go()
  console.log(games)

  let now = new Date()
  let m = moment(now).utcOffset(8)
  let time = m.format('YYYY-MM-DD-HH-mm-ss')
  let date = m.format('YYYY-MM-DD')

  try {
    let jsonStr = JSON.stringify(games, null, 2)
    await outputOSS(`${date}/active-games-${time}.json`, jsonStr)
  } catch (e) {}
}

module.exports.handler = (event, context, callback) => {
  run().then(res => {
    callback(null, res)
  })
}

// run().then()