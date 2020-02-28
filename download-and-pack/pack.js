const fs = require('fs')
const parseHTML = require('../code/lib/parse-leaderboard-html')

// 检查命令行参数
const DATE = process.argv[2]
if (!DATE) {
  console.log(`usage: node pack.js 2020-xx-xx`)
  process.exit(0)
}
console.log(`DATE: ${DATE}`)

const uniqBy = (arr, keyName) => {
  let uniqValues = {}
  let uniqData = []
  arr.forEach(x => {
    let value = x[keyName]
    if (!uniqValues[value]) {
      uniqValues[value] = value
      uniqData.push(x)
    }
  })
  return uniqData
}

const pack = async () => {
  let data = []

  let dir = `output/${DATE}-htmls`
  let files = fs.readdirSync(dir).filter(x => x.includes('.html'))
  for (let f of files) {
    let htmlContent = fs.readFileSync(`${dir}/${f}`)
    let d = parseHTML(htmlContent)
    data = [].concat(data).concat(d)
    console.log(f)
  }

  let outputData = data
    .filter(x => x.place === '1st') // 第一名
    .filter(x => !x.leaderboardLink.match(/\/.+\//)) // 非 level
    .filter(x => x.datetime.includes(DATE)) // 当天

  // 根据成绩链接去重
  outputData = uniqBy(outputData, 'link')

  // 不能根据榜单去重，因为可能有若干子榜

  fs.writeFileSync(`output/${DATE}-pack.json`, JSON.stringify(outputData, null, 2))
  console.log(`outputed ${ outputData.length } results`)
}

pack().then()