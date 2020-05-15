const OSS = require('ali-oss')
const ossClient = new OSS({
  "region": process.env.SIBBAY_OSS_REGION,
  "bucket": process.env.SIBBAY_OSS_WEB_TUI_BUCKET_NAME,
  "accessKeyId": process.env.SIBBAY_OSS_ACCESS_KEY_ID,
  "accessKeySecret": process.env.SIBBAY_OSS_ACCESS_KEY_SECRET
})

module.exports = ossClient