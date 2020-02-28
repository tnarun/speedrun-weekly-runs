require('should')

const utils = require('../lib/utils')

describe('utils', async () => {
  it('utils.getRunDetail', () => {
    should(utils.getRunDetail).ok()
  })

  it('https://www.speedrun.com/sekiro/run/y21w397z', async function () {
    this.timeout(10000)

    let data = await utils.getRunDetail({ runId: 'y21w397z' })
    should(data).ok()

    // console.log(data)

    let run = data.run
    should(run).ok()
    should(run.id).equal('y21w397z')
    should(run.game.data).ok()

    let runVars = data.runVars
    should(runVars).ok()
    should(runVars.length).equal(2)
    should(runVars[0].key).equal('gnxrw1jn')
    should(runVars[1].key).equal('2lgg107l')

    let leaderboard = data.leaderboard
    should(leaderboard).ok()
    should(leaderboard.runs.length >= 26).be.true()
  })

  it('yj3vpkoz', async function () {
    this.timeout(10000)

    let data = await utils.getRunDetail({ runId: 'yj3vpkoz' })
    should(data).ok()
  })
})