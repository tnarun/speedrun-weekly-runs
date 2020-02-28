const fs = require('fs')

// 检查命令行参数
const DATE = process.argv[2]
if (!DATE) {
  console.log(`usage: node best.js 2020-xx-xx`)
  process.exit(0)
}
console.log(`DATE: ${DATE}`)

const best = async () => {
  let data = JSON.parse(fs.readFileSync(`output/${DATE}-detail.json`))
  
  let sort = data.sort((a, b) => {
    return b.leaderboard.runs.length - a.leaderboard.runs.length
  })

  let output = sort.map(x => {
    return {
      link: x.run.weblink,
      length: x.leaderboard.runs.length
    }
  })

  console.log(output)
}

best().then()
