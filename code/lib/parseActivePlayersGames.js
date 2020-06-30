// 获取高热度游戏

const fetch = require('node-fetch')
const cheerio = require('cheerio')

const URLP1 = 'https://www.speedrun.com/ajax_games.php?game=&platform=&unofficial=off&orderby=mostactive&title=&series=&start=0'

const URLP2 = 'https://www.speedrun.com/ajax_games.php?game=&platform=&unofficial=off&orderby=mostactive&title=&series=&start=50'

const fetchPage = async ({ url }) => {
  let res = await fetch(url)
  let htmlContent = await res.text()
  let $ = cheerio.load(htmlContent)

  let games = []
  let $games = $('div.listcell')
  $games.each((idx, elm) => {
    let $game = $(elm)
    games[idx] = parseGame($, $game)
  })

  return games
}

const parseGame = ($, $game) => {
  let $a = $game.find('a[data-url]')
  let link = $a.attr('href')
  let abbr = $a.data('url')

  let gameName = $game.find('.game-name').text()
  let activePlayers = $game.find('p.text-muted').text().trim()
  let activePlayersCount = ~~(activePlayers.split(' ')[0])

  return { abbr, link, gameName, activePlayers, activePlayersCount }
}

class Parser {
  async go () {
    let games1 = await fetchPage({ url: URLP1 })
    let games2 = await fetchPage({ url: URLP2 })
    return [].concat(games1).concat(games2)
  }
}

module.exports = Parser