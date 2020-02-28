const moment = require('moment')
const path = require('path')
const mkdirp = require('mkdirp')
const ossClient = require('./lib/ossClient')

// 检查命令行参数
const DATE = process.argv[2]
if (!DATE) {
  console.log(`usage: node down.js 2020-xx-xx`)
  process.exit(0)
}
console.log(`DATE: ${DATE}`)

const getAllOssFileNames = async ({ prefix }) => {
  let res = await ossClient.list({ prefix, 'max-keys': 1000 })
  return res.objects.map(x => x.name)
}

// 获取范围
// 当天的全部 + 第二天 12:00 及之前的
const download = async () => {
  let thisDate = DATE
  let nextDate = moment(DATE).add(1, 'day').format('YYYY-MM-DD')
  // console.log({ thisDate, nextDate })

  let filesOfThisDate = await getAllOssFileNames({ 
    prefix: `speedrun-weekly-leaderboard-runs-data/${thisDate}/latest` 
  })

  let filesOfNextDate = await getAllOssFileNames({ 
    prefix: `speedrun-weekly-leaderboard-runs-data/${nextDate}/latest` 
  })

  let htmlFiles = [].concat(filesOfThisDate).concat(filesOfNextDate)
    .filter(x => x.includes('.html'))
    .filter(x => {
      let str = path.basename(x).substr(18,19)
      return moment(str, "YYYY-MM-DD-HH-mm-ss") < moment(`${nextDate} 13:00`)
    })
  // console.log({ htmlFiles })

  let dir = `output/${thisDate}-htmls`
  mkdirp.sync(dir)

  for (let name of htmlFiles) {
    await ossClient.get(name, `${dir}/${path.basename(name)}`)
    console.log(name)
  }

  console.log(`downloaded ${htmlFiles.length} files`)
}

download().then()
