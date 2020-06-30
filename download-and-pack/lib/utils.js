// const ENDPOINT = `https://1246105.cn-hongkong.fc.aliyuncs.com/2016-08-15/proxy/speedrun-api-directly/api`
const ENDPOINT = `https://www.speedrun.com/api/v1`

const fetch = require('node-fetch')

const get = async ({ path }) => {
  let url = `${ENDPOINT}${path}`
  let res = await fetch(url)
  let data = await res.json()
  return data
}

// https://github.com/speedruncomorg/api/blob/master/version1/runs.md
const getRun = async ({ id }) => {
  let path = `/runs/${id}?embed=game.variables,category,level,players,region,platform`
  return await get({ path })
}

// https://github.com/speedruncomorg/api/blob/master/version1/leaderboards.md
const getLeaderboardWithCategory = async ({ gameId, categoryId, runVars }) => {
  let varsParams = runVars.map(crv => `var-${crv.key}=${crv.value}`).join('&')
  let path = `/leaderboards/${gameId}/category/${categoryId}?embed=game,category,level,players,regions,platforms,variables&${varsParams}`
  return await get({ path })
}

const buildRunVars = ({ runData }) => {
  let gameVariables = runData.data.game.data.variables.data
  let runValues = runData.data.values
  
  // 榜单划分依据：子分类 subcategory
  let subCategories = gameVariables.filter(v => {
    let c1 = v['is-subcategory'] === true
    let c2 = !!runValues[v.id]
    return c1 && c2
  }).map(c => {
    return { id: c.id, name: c.name, values: c.values }
  })
  
  // console.log(JSON.stringify(subCategories, null, 2))

  // 当前 run 的子分类变量
  let runVars = subCategories.map(c => {
    let key = c.id
    let value = runValues[key]
    let name = c.name
    let current = c.values.values[value]
    let currentLabel = current.label
    let allLabels = Object.values(c.values.values).map(x => x.label)
    return { key, value, name, current, currentLabel, allLabels }
  })

  return runVars
}

// 根据 run id 获取完整的 run 和 leaderboard 信息
const getRunDetail = async ({ runId }) => {
  let runData = await getRun({ id: runId })
  if (runData.status === 404) {
    throw new Error('run 404')
  }

  let runVars = buildRunVars({ runData })

  let gameId = runData.data.game.data.id
  let categoryId = runData.data.category.data.id
  let leaderboardData = await getLeaderboardWithCategory({ gameId, categoryId, runVars })

  return {
    run: runData.data,
    runVars,
    leaderboard: leaderboardData.data
  }
}

module.exports = {
  getRunDetail
}