const cheerio = require('cheerio')

const parseRun = ($, $run) => {
  let link = $run.attr('data-target')
  let gameAbbr = link.split('/')[1]
  let title = $run.attr('title')

  let leaderboardLink = $run.find('td:nth-child(1) a').attr('href')
  let leaderboardName = $run.find('td:nth-child(1) a').text()

  let place = $run.find('td:nth-child(2)').text()

  let runners = []
  $run.find('td:nth-child(3) .link-username').each((idx, elm) => {
    let $elm = $(elm)
    let link = $elm.attr('href')
    let name = $elm.find('.username-light').text()
    let region = $elm.find('span[data-original-title]').data('original-title')
    let flagicon = $elm.find('img.flagicon').attr('src')

    runners[idx] = { 
      link, name, region, flagicon
    }
  })

  let timeStr = $run.find('td:nth-child(4)').text()
  let datetime = $run.find('td:nth-child(5) time').attr('datetime')

  return {
    link, gameAbbr, title,
    leaderboardLink, leaderboardName,
    place, timeStr,
    runners,
    datetime
  }
}

module.exports = (htmlContent) => {
  let $ = cheerio.load(htmlContent)

  let runs = []
  let $runs = $('tr.height-minimal.linked')
  $runs.each((idx, elm) => {
    let $run = $(elm)
    runs[idx] = parseRun($, $run)
  })

  return runs
}