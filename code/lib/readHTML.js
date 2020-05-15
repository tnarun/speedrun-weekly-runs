// 下载某一天的爬虫 html 数据

const moment = require('moment')
const path = require('path')
const ossClient = require('./ossClient')

const getAllOssFileNames = async ({ prefix }) => {
  let res = await ossClient.list({ prefix, 'max-keys': 1000 })
  let objects = res.objects || []
  return objects.map(x => x.name)
}

// 获取范围
// 当天的全部 + 第二天 12:00 及之前的
const download = async ({ DATE }) => {
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

  let htmlContents = []

  for (let name of htmlFiles) {
    let res = await ossClient.get(name)
    console.log(`get ${name}`)
    htmlContents.push(res.content)
  }

  console.log(`got ${htmlContents.length} files`)
  return htmlContents
}

// download().then()
module.exports = download
