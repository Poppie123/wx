const {http} = require('../../utils/util.js')
// pages/bindphone/bindphone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    code:"",
    time:"获取验证码"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 获取验证码
   */
  getCode(){
    if(!this.data.phone){
      wx.showToast({title:"请输入手机号",icon:'none'})
      return false
    }
    if (this.data.time !== "获取验证码"){
       return false
    }
    this.setData({
      time:"59S",
    })
    http('/user/get_code',{phone:this.data.phone}).then(res => {
      var msg = (res.msg).toString();
      console.log(msg)
      wx.showToast({ title: msg, icon: 'none' })
      if(res.code == 1){
        this.startTimeout();
      }
    })
  },
  /**
   * 验证码倒计时
  */
  startTimeout(){
     var t = 59;
     var timp = setInterval(()=>{
        t--;
        if(t < 1){
          clearInterval(timp);
          this.setData({
            time:"获取验证码"
          })
        }else{
          this.setData({
            time:t+"S"
          })
        }
     },1000)
  },
  /**
   * 绑定
  */
  bindPhone(){
    if(this.data.phone === ""){
      return false
    }
    if(this.data.code === ""){
      return false
    }
    wx.showLoading({
      title: '绑定中...',
    })
    http('/user/wx_bind_phone',{
      phone:this.data.phone,
      code:this.data.code,
    }).then( res => {
      wx.hideLoading()
      if(res.code == 1){
        wx.switchTab({
          url: '../main/main'
        })
      }else{
        wx.showToast({ title: '绑定失败', icon: 'none' })
      }
    })
  },
  /**
   * 监听手机号
  */
  bindPhoneInput(e){
     this.setData({
       phone:e.detail.value,
     })
  },
  /**
   * 监听验证码
  */
  bindCodeInput(e){
    this.setData({
      code: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})