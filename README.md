# speedrun-weekly-runs

以周为单位抓取 speedrun 上的纪录成绩 (run).

## 主文件

`code/spider.js`

## 存储位置

`tna-upload/speedrun-weekly-leaderboard-runs-data/${date}`

## 每日简报生成

- 需要考虑时区差异带来的日期问题如何处理  
  目前考虑：`xxxx-xx-x1-08-xx-xx` - `xxxx-xx-x2-07-xx-xx`  
  取零时区  