const parseHTML = require('./parse-leaderboard-html')

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

const pack = async ({ DATE, htmlContents }) => {
  let data = []

  htmlContents.forEach((htmlContent, idx) => {
    let d = parseHTML(htmlContent)
    data = [].concat(data).concat(d)
    console.log(idx)
  })

  let outputData = data
    .filter(x => x.place === '1st') // 第一名
    .filter(x => !x.leaderboardLink.match(/\/.+\//)) // 非 level
    .filter(x => x.datetime.includes(DATE)) // 当天

  // 根据成绩链接去重
  outputData = uniqBy(outputData, 'link')

  // 不能根据榜单去重，因为可能有若干子榜
  
  console.log(`outputed ${ outputData.length } results`)
  return outputData
}

module.exports = pack