const {http} = require('../../utils/util.js')
// pages/car/car.html.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carList:[], //购物车列表
    allCheck:false,
    allNum:0,
    allPrice:0.00,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      icon:"none"
    })
    this.getCarList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 获取购物车列表
  */
  getCarList(){
    http('/app/get_cart',{start:0}).then(res => {
      wx.hideNavigationBarLoading();
      wx.hideLoading();
      if(res.code == 1){
        let carList = res.data.map(v => {v.status = false;return v})
        this.setData({
          carList:res.data,
        })
      }
    })
  },
  /**
   * 增加购物车数量
   * @param:idx //某个商品
  */
  addNum(e){
    let idx = e.currentTarget.dataset.idx;
    let carList = this.data.carList;
    carList[idx].goods_num++;
    this.setData({
      carList: carList,
    });
    this.computedPrice()
  },
  /**
   * 减少购物车数量
   * @param:idx //某个商品
  */
  reduceNum(e){
    let idx = e.currentTarget.dataset.idx;
    let carList = this.data.carList;
    carList[idx].goods_num--;
    if (carList[idx].goods_num <=0){
      return false
    };
    this.setData({
      carList: carList,
    });
    this.computedPrice();
  },
  /**
   * 单选事件
  */
  checkboxChange(e) {
    let carList = this.data.carList;
    carList = carList.map((v,i) => {
      let findIdx =  e.detail.value.indexOf(i.toString());
      v.status = findIdx != "-1";
      return v
    })
    this.setData({
      carList: carList,
    });
    this.computedPrice()
  },
  /**
   * 全选事件
  */
  checkAllboxChange(e){
    let currentAllCheck = !this.data.allCheck;
    let carList = this.data.carList.map(v => { v.status = currentAllCheck;return v});
    this.setData({
      allCheck: !this.data.allCheck,
      carList: carList,
    });
    this.computedPrice()
  },
  /**
   * 购物车删除事件
  */
  onClickDelete(e){
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除这个商品吗',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
            icon: "none"
          })
          let idx = e.currentTarget.dataset.idx;
          let carList = _this.data.carList;
          let carIdx = carList[idx].goods_id;
          http('/app/del_cart_goods', { cart_ids: carIdx }).then(res => {
            wx.hideLoading()
            if (res.code == 1) {
              carList.splice(idx, 1);
              _this.setData({ carList: carList, });
            } else {   
              wx.showToast({
                title: '删除失败',
              })
            }
          }).catch(err => {
            wx.showToast({
              title: '删除失败',
            })
          })
        } else if (res.cancel) {
          
        }
      }
    })
   
  },
  /**
   * 计算总价格和总数量
  */
  computedPrice(){
    //计算总数
    let allNum = this.data.carList.reduce((total,val,idx) => {
      return val.status ? total += Number(val.goods_num) : total+=0;
    },0);
    //计算总价
    let allPrice = this.data.carList.reduce((total, val, idx) => {
      return val.status ? total += (Number(val.goods_num) * Number(val.shop_price)) : total += 0;
    },0);
    //检测是否全选
    let allCheck = (this.data.carList.filter(v => v.status)).length ==  this.data.carList.length;
    this.setData({
      allNum: allNum,
      allPrice: allPrice,
      allCheck: allCheck,
    })
  },
  /**
   * 下单
  */
  carCreateOrder(){
    
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
    this.getCarList();
    wx.showNavigationBarLoading()
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