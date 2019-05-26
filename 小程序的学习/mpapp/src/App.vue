
<script>
export default {
  async created () {
    // this.onGotUserInfo()
    // qcloud.setLoginUrl(config.loginUrl);
    // qcloud.login({
    //     success: function (userInfo) {
    //         console.log('登录成功', userInfo);
    //         wx.setStorageSync("userinfo", userInfo)
    //     },
    //     fail: function (err) {
    //         console.log('登录失败', err);
    //     }
    // });

    // const res = await get('/weapp/demo')
    // console.log(123, res)
    console.log('小程序启动了')
  }
}
</script>

<style>
  .btn {
    color: white;
    background: #ea5a49;
    margin-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 2px;
    font-size: 16px;
    line-height: 40px;
    height: 40px;
    width: 100%;
  }
  .btn:active {
    background: #fa5a49;
  }
</style>

