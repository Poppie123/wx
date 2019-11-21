const {http} = require('../../utils/util.js')
const app = getApp();
// pages/userinfo/userinfo.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tuijianList:[],
    userInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo:app.globalData.userInfo,
    })
    this.getTuijian();
  },
  jump(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  // 获取推荐商品
  getTuijian(){
    http('/goods/get_top_goods', { sort_type:1 ,start:0}).then(res => {
      if(res.code == 1){
         this.setData({
           tuijianList:res.data,
         })
      }
    })
  },
  /**
   * 跳转关于我们
  */
  toAboutMe(){
    wx.navigateTo({
      url: '../aboutme/aboutme',
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