// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal:"",
    inputShowed:false,
    historyList: [{ keyword: "swisse", }, { keyword: "新款", }, { keyword: "智能机器人", }, { keyword: "刮胡刀", }],
    isShowNav:false,
    sortType:1,
    goodsList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showInput()
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    // getList(this);
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    // getList(this);
  },
  inputTyping: function (e) {
    //搜索数据
    // getList(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
  },
  /**
   * 获取历史记录数据
  */
  getHistorylist(){
    http('/app/get_keyword_history').then( res => {
      if(res.code == 1){
        this.setData({
          historyList:res.data,
        })
      }
    })
  },
  /**
   * 发起搜索
  */
  sendSearch(){
    let val = this.data.inputVal;
    if(val === ""){
      return false
    }
    this.setData({
      isShowNav:true,
    })
    wx.showLoading({
      title: '加载中',
    })
    http('/goods/search_goods',{
      keyword:val,
      start:0,
      order:this.data.sortType,
    }).then( res => {
      wx.hideLoading();
      if(res.code == 1){
        this.setData({
          goodsList:res.data,
        })
      }
    }).catch( err => {
      wx.hideLoading();
    })
  },
  /**
   *历史记录点击
  */
  hisClick(e){
    let val = e.currentTarget.dataset.his;
    this.setData({
      inputVal:val,
    })
    this.sendSearch()
  },
  /**
   * 删除历史记录数据
  */
  detelHistory(){
    let  _this = this;
    wx.showModal({
      title: '提示',
      content: '确认要删除全部数据吗',
      success(res){
        if(res.confirm){
            wx.showLoading({
              title: '删除中',
            });
            _this.setData({
              historyList: [],
            })
            wx.hideLoading()
          // http('/app/del_keyword_history').then( res => {
          //   wx.hideLoading();
          //   if(res.code == 1){
          //     this.setData({
          //        historyList:[],
          //     })
          //   }
          // }).catch( err => {
          //   wx.hideLoading()
          // })
        }else{

        }
      }
    })
  },
  /**
   * 改变排序方式
  */
  changeSortType(e) {
    var currentType = e.currentTarget.dataset.order;
    if (currentType == 1) {
      this.setData({
        sortType: currentType,
        goodsList: [],
      })
    } else if (currentType == 4) {
      if (this.data.sortType == 3) {
        this.setData({
          sortType: 4,
          goodsList: [],
        })
      } else {
        this.setData({
          sortType: 3,
          goodsList: [],
        })
      }
    } else if (currentType == 6) {
      if (this.data.sortType == 6) {
        this.setData({
          sortType: 5,
          goodsList: [],
        })
      } else {
        this.setData({
          sortType: 6,
          goodsList: [],
        })
      }
    }
    this.sendSearch();
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