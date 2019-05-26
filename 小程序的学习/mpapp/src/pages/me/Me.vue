<template>
  <div class="container">
    <div class="userinfo">
      <button open-type="getUserInfo" @getuserinfo="onGotUserInfo">
        <img :src="userinfo.avatarUrl" alt="">
      </button>
      <p>{{userinfo.nickName}}</p>
    </div>
    <year-progress></year-progress>

    <button v-if="userinfo.openId" @click="scanBook" class="btn">添加图书</button>
  </div>
</template>

<script>
import {showSuccess, post, showModal} from '@/util'
import qcloud from 'wafer2-client-sdk'
import config from '@/config'

import YearProgress from '@/components/YearProgress'

export default {
  data () {
    return {
      userinfo: {
        avatarUrl: '../../static/img/me.png',
        nickName: '请点击登录'
      }
    }
  },
  components: {
    YearProgress
  },
  created () {
    this._onshow()
  },
  methods: {
    onGotUserInfo (e) {
      const user = wx.getStorageSync('userinfo')
      const self = this
      if (!user) {
        qcloud.setLoginUrl(config.loginUrl)
        qcloud.login({
          success: function (userInfo) {
            qcloud.request({
              url: config.userUrl,
              login: true,
              success (userRes) {
                showSuccess('登录成功')
                wx.setStorageSync('userinfo', userRes.data.data)
                self.userinfo = userRes.data.data
              }
            })
          },
          fail: function (err) {
            console.log('登录失败', err)
          }
        })
      }
    },
    scanBook () {
      const self = this
      wx.scanCode({
        success (res) {
          if (res.result) {
            console.log(res.result)
            self.addBook(res.result)
          }
        }
      })
    },
    async addBook (isbn) {
      const res = await post('/weapp/addbook', {
        isbn,
        openid: this.userinfo.openId
      })
      console.log(res)
      showModal('添加成功', `${res.title}添加成功`)
    },
    _onshow () {
      let userinfo = wx.getStorageSync('userinfo')
      if (userinfo) {
        this.userinfo = userinfo
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 0 30rpx;
    .userinfo {
      margin-top: 100rpx;
      text-align: center;
      button {
        background-color: transparent;
        padding: 0;
        &::after {
          border: none;
        }
        img {
          width: 150rpx;
          height: 150rpx;
          margin: 20rpx;
          border-radius: 50%;
        }
      }

    }
  }
</style>
