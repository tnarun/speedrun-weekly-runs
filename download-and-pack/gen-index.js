const ossClient = require('./lib/ossClient')
const fs = require('fs')

const YEAR = 2020

const getMonthFileNames = async ({ year, month }) => {
  let yearMonth = `${year}-${month}`
  let prefix = `speedrun-weekly-leaderboard-runs-data/${yearMonth}-`
  let res = await ossClient.list({ prefix, 'max-keys': 1000, delimiter: '/' })
  // console.log((res.objects || []).map(x => x.name))
  let fNames = (res.objects || []).map(x => x.name)
    .filter(x => {
      return x.match(/\d{4}-\d{2}-\d{2}-detail.json/)
    })
  return fNames
}

const run = async () => {
  let allFileNames = []

  // 获取 detail 文件清单
  for (let i = 1; i <= 12; i++) {
    let year = YEAR
    let month = i > 9 ? `${i}` : `0${i}`
    let fNames = await getMonthFileNames({ year, month })
    console.log(year, month, fNames)
    allFileNames = [].concat(allFileNames).concat(fNames)
  }

  let dates = allFileNames.map(x => {
    // 匹配 speedrun-weekly-leaderboard-runs-data/2020-02-25-detail.json
    // 中的日期
    let match = x.match(/\d{4}-\d{2}-\d{2}/)
    return match[0]
  })

  // 保存索引至 OSS
  let fileKey = `speedrun-weekly-leaderboard-runs-data/file-names-index.json`
  await ossClient.put(fileKey, Buffer.from(JSON.stringify(dates, null, 2)))
  console.log(`saved ${dates.length} names`)
}

run().then()