const {http} = require('../../utils/util.js') 
// pages/pinpai/paipin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    brandDtl:{},
    brandGds:[],
    sortType:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      id:options.id,
    })
    this.getBrandGds();
  },
  /**
   * 获取品牌商品
  */
  getBrandGds(){
    http('/goods/get_brand_goods',{
      brand_id:this.data.id,
      start: this.data.brandGds.length,
      sort_type: this.data.sortType,
    }).then(res => {
      wx.hideLoading();
      if(res.code == 1){
          let brandGds = res.data.goods_list;
          let brandDtl = res.data.brand_info;
              brandDtl.is_guanzhu = res.data.is_guanzhu;
              brandDtl.count = res.data.count;
          this.setData({
            brandGds: this.data.brandGds.concat(res.data.goods_list),
            brandDtl: brandDtl,
          })
      }
    })
  },
  /**
   * 改变筛选条件
  */
  changeSort(e){
    let sortType = e.currentTarget.dataset.order;
    if(sortType == 1){
      this.setData({ sortType:1})
    }else if(sortType == 4){
      if (this.data.sortType == 3){
        this.setData({ sortType: 4 })
      }else{
        this.setData({ sortType: 3 })
      }
    }else if(sortType == 6){
      if (this.data.sortType == 5) {
        this.setData({ sortType: 6 })
      } else {
        this.setData({ sortType: 5 })
      }
    }
    this.setData({
      brandGds:[],
    })
    console.log(this.data.sortType)
    this.getBrandGds();
  },
  /**
   * 店铺关注
   * @param:brand_id;
  */
  followShop(){
    http('/user/user_collect_brand', { brand_id:this.data.id}).then( res => {
      if(res.code == 1){
        let brandDtl = this.data.brandDtl;
        brandDtl.is_guanzhu = this.data.brandDtl.is_guanzhu == 0 ? 1 : 0;
        this.setData({
          brandDtl: brandDtl,
        })
        wx.showToast({ title: "关注成功",icon:"none" })
      }else{
        wx.showToast({ title: "关注失败", icon: "none"})
      }
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