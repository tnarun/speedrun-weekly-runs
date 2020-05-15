const moment = require('moment')
const fetch = require('node-fetch')
const fs = require('fs')
const mkdirp = require('mkdirp')
const ossClient = require('./lib/ossClient')

const _ = require('lodash')

// 检查命令行参数
const FROM = process.argv[2]
const TO = process.argv[3]

if (!(FROM && TO)) {
  console.log(`usage: node bundle-week.js 2020-xx-xx 2020-xx-xx`)
  process.exit(0)
}
console.log(`FROM: ${FROM} TO: ${TO}`)

const fetchDateDetail = async (date) => {
  let url = `http://tna-upload.oss-cn-shanghai.aliyuncs.com/speedrun-weekly-leaderboard-runs-data/${date}-detail.json`
  let res = await fetch(url)
  return await res.json()
}


const clean = (data) => {
  let res = data.map(x => {
    let leaderboard = x.leaderboard
    let length = leaderboard.runs.length
    let weblink = leaderboard.weblink
    let d = Object.assign({}, x, { leaderboard: { length, weblink } })
    return d
  })
  return res
}

const uniq = (data) => {
  let res = _.uniqWith(data, (a, b) => {
    let arun = a.run
    let brun = b.run
    let c1 = arun.game.data.id === brun.game.data.id
    let c2 = arun.category.data.id === brun.category.data.id
    let c3 = JSON.stringify(arun.values) === JSON.stringify(brun.values)
    return c1 && c2 && c3
  })

  return res
}

const run = async () => {
  let data = []
  let from = moment(FROM)
  let to = moment(TO)
  for (let i = from; i <= to; i.add(1, 'days')) {
    let date = i.format('YYYY-MM-DD')
    // console.log(date)
    let d = await fetchDateDetail(date)
    console.log(`fetch date ${date}`)
    data = [].concat(data).concat(d)
  }

  data = clean(data)
  console.log(`packed ${data.length} runs`)

  data = uniq(data)
  
  mkdirp.sync(`output/from-to/`)
  let dstr = JSON.stringify(data, null ,2)
  let fname = `${FROM}-${TO}-week-detail.json`
  fs.writeFileSync(`output/from-to/${fname}`, dstr)

  let fileKey = `speedrun-weekly-leaderboard-runs-data/from-to/${fname}`
  await ossClient.put(fileKey, Buffer.from(dstr))

  console.log(`output ${data.length} runs`)
}

run().then()