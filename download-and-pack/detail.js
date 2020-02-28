const fs = require('fs')
const utils = require('./lib/utils')
const ossClient = require('./lib/ossClient')

const DATE = process.argv[2]
if (!DATE) {
  console.log(`usage: node detail.js 2020-xx-xx`)
  process.exit(0)
}

console.log(`DATE: ${DATE}`)

const run = async () => {
  let data = require(`./output/${DATE}-pack.json`)
  
  let res = []
  for (let d of data) {
    try {
      let runId = d.link.split('/run/')[1]
      let data = await utils.getRunDetail({ runId })
      res.push(data)
      console.log(d.link)
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

  let dstr = JSON.stringify(res, null, 2)
  fs.writeFileSync(`output/${DATE}-detail.json`, dstr)

  let fileKey = `speedrun-weekly-leaderboard-runs-data/${DATE}-detail.json`
  await ossClient.put(fileKey, Buffer.from(dstr))
}

run().then()
