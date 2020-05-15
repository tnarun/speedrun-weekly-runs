const moment = require('moment')
const fetch = require('node-fetch')
const fs = require('fs')
const mkdirp = require('mkdirp')
const ossClient = require('./lib/ossClient')

// 检查命令行参数
const DATE = process.argv[2]
if (!DATE) {
  console.log(`usage: node bundle-week.js 2020-xx-xx`)
  process.exit(0)
}
console.log(`DATE: ${DATE}`)

const fetchDateDetail = async (date) => {
  let url = `http://tna-upload.oss-cn-shanghai.aliyuncs.com/speedrun-weekly-leaderboard-runs-data/${date}-detail.json`
  let res = await fetch(url)
  return await res.json()
}

const run = async () => {
  let data = []
  for (let i = 6; i >= 0; i --) {
    let date = moment(DATE).subtract(i, 'day').format('YYYY-MM-DD')
    let d = await fetchDateDetail(date)
    console.log(date)
    data = [].concat(data).concat(d)
  }
  
  mkdirp.sync(`output/weeks/`)
  let dstr = JSON.stringify(data, null ,2)
  fs.writeFileSync(`output/weeks/${DATE}-week.json`, dstr)

  let fileKey = `speedrun-weekly-leaderboard-runs-data/weeks/${DATE}-week-detail.json`
  await ossClient.put(fileKey, Buffer.from(dstr))
}

run().then()