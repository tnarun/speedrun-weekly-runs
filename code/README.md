# 一周成绩数据抓取

## 思路一

通过 `https://www.speedrun.com/api/v1/runs?status=verified&orderby=verify-date&direction=desc` 抓取多页

问题：
- 本地运行缓慢。需要到海外 ecs 上运行。一周的 runs 数据量在十几 mb 左右。
- 条目过多
- 条目难以过滤（很难知道每个 run 具体是 leaderboard 的第几位）

运行：
- `node get-week-runs.js` 获取指定日期之后的 runs. 修改代码中 fromDate  
  缺点：本地运行缓慢，效率低。建议到 ecs 运行。

## 思路二 (2020-02-24 暂时使用此方案)

通过 `https://www.speedrun.com/ajax_latestleaderboard.php?amount=10000` 来抓取

### 问题：
- 数据结构解析起来比较麻烦（抓来的是网页 html）
- amount 参数不知是否靠谱，可能会有数据遗漏
- 不稳定，可能某一天会被封掉

### 实现：  
method-2.js

### 爬虫：
speedrun-weekly-leaderboard-runs  
部署在香港  
每小时运行一次  