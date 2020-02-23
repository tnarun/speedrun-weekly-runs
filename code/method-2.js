let fetch = require('node-fetch')
let fs = require('fs')
let parseHTML = require('./lib/parse-leaderboard-html')

const output = (fname, data) => {
  fs.writeFileSync(fname, data)
}

const run = async () => {
  let res = await fetch(`https://www.speedrun.com/ajax_latestleaderboard.php?amount=1000`)
  let html = await res.text()

  output('latestleaderboard.html', html)
  let data = parseHTML(html)
  fs.writeFileSync('latestleaderboard.json', JSON.stringify(data, null, 2))
}

run().then()