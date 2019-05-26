var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var port = process.env.PORT || config.build.port

var app = express()
var apiRouters = express.Router()

apiRouters.get('/api/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    // let ret = response.data
    // if (typeof ret === 'string') {
    //   let reg = /^\w+\(({[^()]+})\)$/
    //   let matches = ret.match(reg)
    //   if (matches) {
    //     ret = JSON.perse(matches[1])
    //   }
    // }
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
apiRouters.get('/api/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
apiRouters.get('/api/getSongList', (req,res) => {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url,{
    headers: {
      referer: 'https://y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/  //定义正则去匹配我们返回的那个字符串
      var matches = ret.match(reg) //matches 是一个数组，数组的第一项是整个字符串，第二项是正则中有()里面的内容 ,通过match匹配正则，如果正则有()，则括号里面的内容也将作为match数组的一项
      if (matches) {
        ret = JSON.parse(matches[1])//获取到数组的第二项，并将其转成json格式
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
apiRouters.get('/api/getSearch', (req,res) => {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url,{
    headers: {
      referer: 'https://y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/  //定义正则去匹配我们返回的那个字符串
      var matches = ret.match(reg) //matches 是一个数组，数组的第一项是整个字符串，第二项是正则中有()里面的内容 ,通过match匹配正则，如果正则有()，则括号里面的内容也将作为match数组的一项
      if (matches) {
        ret = JSON.parse(matches[1])//获取到数组的第二项，并将其转成json格式
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRouters)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
