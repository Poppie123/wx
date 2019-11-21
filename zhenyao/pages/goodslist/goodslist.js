const {http} = require('../../utils/util.js')
// pages/goodslist/goodslist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowNav:false,  //是否展示筛选
    cateId: "", //上个页面参数
    title:"",   //上个页面参数
    type:0,     //上个页面参数  0=> 是最顶部菜单  1 是热销商品
    list:[],
    sortType:1,
    pageInfo:[{
      url:"/goods/get_cates_goods",
      pageParam:{
        cate_id: "",
      }
    },{
      url:"/goods/search_hot",
      pageParam: {
        price_order: "",
      }
    },{
      url: "/goods/get_cate_goods",
      pageParam: {
        cate_id: "",
      }
    }, {
      url: "/goods/get_sales_goods",
      pageParam: {
        sort_type: "",
      }
    }, {
      url: "/goods/get_top_goods",
      pageParam: {
        sort_type: "",
      }
    }],
  },
  //
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.handerPage(options)             //处理不同页面跳转进来的参数
    wx.setNavigationBarTitle({
      title: options.title,              //设置当前页面title
    })
  },
  /**
   * 处理不同页面进来不同的接口和参数
  */
  handerPage(options){
    var currentType = options.type;
    var pageInfo = this.data.pageInfo;
    switch (currentType){
      case '0':    //顶部菜单类型
        pageInfo[0].pageParam.cate_id = options.catid;
      break;
      case '1':    //热销商品
        pageInfo[1].pageParam.price_order = 1;
      break;
      case '2':    //国家馆点击
        pageInfo[2].pageParam.cate_id = options.catid;
      break;
      case '3':    //精选专场查看更多
        pageInfo[3].pageParam.sort_type = 1;
      break;
      case '4':    //商品推荐查看更多
        pageInfo[3].pageParam.sort_type = 1;
      break;
    }
    this.setData({
      type: options.type,
      pageInfo: pageInfo,
      isShowNav: options.type == 1 || options.type == 2 || options.type == 3 || options.type == 4, 
    })
    this.getList();
  },
  /**
   * 获取展示数组
  */
  getList(){
    let currentType = this.data.type;   
    let currentReq = this.data.pageInfo[currentType];
    currentType == 1  ? currentReq.pageParam.price_order = this.data.sortType : "";
    currentType == 2 ? currentReq.pageParam.order = this.data.sortType : "";
    currentType == 3 || currentType == 4? currentReq.pageParam.sort_type = this.data.sortType : "";
    currentReq.pageParam.start = this.data.list.length; //组装公共参数
    http(currentReq.url, currentReq.pageParam).then(res => {
      wx.hideLoading()
      if(res.code == 1){
        this.setData({
          list:this.data.list.concat(this.data.type == 0 ? res.data.goods_list : res.data),
        })
      }
    }).catch(err => {
      wx.hideLoading();
    })
  },
  /**
   * 改变分类方式
  */
  changeSortType(e){
    var currentType = e.currentTarget.dataset.order;
    if (currentType == 1){
      this.setData({
        sortType:currentType,
        list:[],
      }) 
    }else if(currentType == 4){
      if(this.data.sortType == 3){
        this.setData({
          sortType:4,
          list: [],
        })
      }else{
        this.setData({
          sortType: 3,
          list: [],
        })
      }
    } else if (currentType == 6){
      if (this.data.sortType == 6) {
        this.setData({
          sortType: 5,
          list: [],
        })
      } else {
        this.setData({
          sortType: 6,
          list: [],
        })
      }
    }
    this.getList();
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
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})