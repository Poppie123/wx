// pages/main/main.js
var {
  http,
  islogin
} = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    menuList: [],
    jingxuanGds: [], //精选商品
    tuijianGds: [], //推荐商品
    pinpaiList: [], //品牌推荐
    countryList: [], //国家馆
    swiperIndex: "",
    rexiaoList: [], //热销商品


    noticeList: [{
      context: "用户156****8888收藏了兰芝精华..."
      },
      {
        context: "用户156****8888收藏了兰芝精华..."
      },
      {
        context: "用户156****8888收藏了兰芝精华..."
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    islogin(); //判断用户是否登录
    setTimeout(() => {
      this.getJingxuanGds();
      this.getTuijianList();
      this.getPinpai();
      this.getContry();
      this.getSalesGds();
    }, 700)
    this.getBanner();
    this.getMenu();


  },
  /**
   * 获取banner图 
   */
  getBanner() {
    http('/app/get_banner', {}).then(res => {
      if (res.code === 1) {
        this.setData({
          imgUrls: res.data,
        })
      }
    })
  },
  // 获取菜单
  getMenu() {
    http('/goods/get_cate_list', {}).then(res => {
      if (res.code == 1) {
        this.setData({
          menuList: res.data.cate_list,
        })
      }
    })
  },
  // 精选专场
  getJingxuanGds() {
    http('/goods/get_sales_goods', {
      sort_type: 1,
      start: 0
    }).then(res => {
      wx.stopPullDownRefresh(); //停止下拉刷新
      if (res.code == 1) {
        let list = res.data.splice(0, 5)
        this.setData({
          jingxuanGds: list,
        })
      }
    })
  },
  //商品推荐
  getTuijianList() {
    http('/goods/get_top_goods', {
      sort_type: 1,
      start: 0
    }).then(res => {
      wx.stopPullDownRefresh(); //停止下拉刷新
      if (res.code == 1) {
        let list = res.data.splice(0, 5)
        this.setData({
          tuijianGds: list,
        })
      }
    })
  },
  // 推荐品牌
  getPinpai() {
    http('/goods/get_top_brand', {}).then(res => {
      if (res.code == 1) {
        this.setData({
          pinpaiList: res.data,
        })
      }
    })
  },
  //获取国家馆
  getContry() {
    http('/nature/get_all_cate', {}).then(res => {
      if (res.code == 1) {
        this.setData({
          countryList: res.data,
        })
      }
    })
  },
  //国家馆轮播图
  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },

  //获取热销商品
  getSalesGds() {
    http('/goods/search_hot', {
      price_order: 1,
      start: 0
    }).then(res => {
      if (res.code == 1) {
        this.setData({
          rexiaoList: res.data,
        })
      }
    })
  },
  /**
   * 跳转商品详情
   */
  toGdsDetail(event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?id=' + id,
    })
  },
  /**
   * 跳转顶部菜单
   */
  toGdslist(event) {
    let catid = event.currentTarget.dataset.catid; //分类id
    let title = event.currentTarget.dataset.title; //分类名称
    wx.navigateTo({
      url: "../goodslist/goodslist?catid=" + catid + "&title=" + title + "&type=0",
    })
  },
  /**
   * 跳转热销商品
   */
  toHotsales() {
    wx.navigateTo({
      url: "../goodslist/goodslist?title=热销商品&type=1",
    })
  },
  /**
   * 跳转品牌主页
   */
  toPinpai(event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../pinpai/pinpai?id=' + id,
    })
  },
  /**
   * 跳转国家馆
   */
  toCountryItem(event) {
    let id = event.currentTarget.dataset.id;
    let name = event.currentTarget.dataset.name;
    wx.navigateTo({
      url: "../goodslist/goodslist?title=" + name + "&type=2&catid=" + id,
    })
  },
  /**
   * 跳转精选专场更多
   */
  toJingxuan(event) {
    wx.navigateTo({
      url: "../goodslist/goodslist?title=精选专场&type=3",
    })
  },
  /**
   * 跳转商品推荐更多
   */
  toTuijian() {
    wx.navigateTo({
      url: "../goodslist/goodslist?title=商品推荐&type=4",
    })
  },
  /**
   * 跳转搜索
   */
  toSearch() {
    wx.navigateTo({
      url: "../search/search",
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('用户下拉了')
    this.getJingxuanGds();
    this.getTuijianList();
    wx.showNavigationBarLoading()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})