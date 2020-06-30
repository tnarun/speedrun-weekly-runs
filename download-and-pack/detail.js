require('../code/env')

// 依赖于自动调度函数
// https://fc.console.aliyun.com/service/cn-hongkong/speedrun-weekly-leaderboard-runs/function/pack/code

const fs = require('fs')
const utils = require('./lib/utils')
const ossClient = require('../code/lib/ossClient')

const DATE = process.argv[2]
if (!DATE) {
  console.log(`usage: node detail.js 2020-xx-xx`)
  process.exit(0)
}

console.log(`DATE: ${DATE}`)

const getPos = async () => {
  let path = `./output/${DATE}-detail-pos.json`
  let exist = fs.existsSync(path)

  if (exist) {
    return require(path)
  } 

  fs.writeFileSync(path, '{}')
  return {}
}

const getPackData = async () => {
  let fileKey = `speedrun-weekly-leaderboard-runs-data/packs/${DATE}-pack.json`
  console.log(`get fileKey: ${fileKey}`)
  let res = await ossClient.get(fileKey)
  let data = JSON.parse(res.content)
  return data
}

const run = async () => {
  let data = await getPackData()
  let posData = await getPos()
  
  // 读取 detail
  let detailPath = `./output/${DATE}-detail.json`
  let res = fs.existsSync(detailPath) ? require(detailPath) : []

  for (let d of data) {
    let runId = d.link.split('/run/')[1]

    try {
      // 如果已经抓取过，则略过
      if (posData[runId]) {
        console.log(`${runId} passed`)
        continue
      }

      // 去除脏数据
      res = res.filter(x => x.run.id !== runId)

      // 获取详细信息
      let data = await utils.getRunDetail({ runId })
      console.log(data.leaderboard.weblink)

      if (!data.leaderboard) {
        continue
      }

      res.push(data)
      console.log(d.link)

      // 写入 detail
      fs.writeFileSync(detailPath, JSON.stringify(res, null, 2))

      // 记录位置
      posData[runId] = true
      fs.writeFileSync(`./output/${DATE}-detail-pos.json`, JSON.stringify(posData, null, 2))
    } catch (e) {
      if (e.message === 'run 404') {
        console.log('404: ', d.link)
      } else {
        console.log('error: ', d.link)
        throw e
      }
    }
  }

  console.log(`got details of ${data.length} runs.`)

  let fileKey = `speedrun-weekly-leaderboard-runs-data/${DATE}-detail.json`
  await ossClient.put(fileKey, Buffer.from(JSON.stringify(res, null, 2)))
}

run().then()
