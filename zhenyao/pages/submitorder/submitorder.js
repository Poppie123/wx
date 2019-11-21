const {http}  = require('../../utils/util.js')
// pages/submitorder/submitorder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     address:{},
     prevPage:{},
     goodsInfo:[],   //商品数据
     otherDt:{},  //其他数据
     textAreaVal:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      prevPage: options
    })
    this.getDefaultAddress();  //获取默认收货地址
    this.getPreOrder()         //订单审核
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     
  },
  /**
   * 订单审核
  */
  getPreOrder(){
    http('/order/get_pre_order',{
      type:1,
      goods_id: this.data.prevPage.goodsId,
      goods_attr_id: this.data.prevPage.goodsAttrId,
      address_id: this.data.prevPage.addressId,
      goods_num: this.data.prevPage.goodsNum,
    }).then( res => {
      if(res.code == 1){
        let arr = [];
        res.data.goods_info.goods_num = res.data.goods_num;
        arr.push(res.data.goods_info);
        this.setData({
          goodsInfo:arr,
          otherDt:res.data,
        })
      }
    });
  },
  /**
   * 人员备注
  */
  bindTextAreaBlur(e){
     this.setData({
       textAreaVal:e.currentTarget.value,
     })
  },
  /**
   * 获取默认收货地址
  */
  getDefaultAddress(){
    http('/user/get_edit_address_info', { address_id: this.data.prevPage.addressId}).then( res => {
      if(res.code == 1){
        this.setData({
          address:res.data,
        })
      }
    })
  },
  /**
   * 页面同意下单入口,分类不同下单模式
  */
  createOrder(){
    this.goputongOrder()
  },
  /**
   * 普通商品下单
  */
  goputongOrder(){
    let config = {
      goods_id: this.data.goodsInfo[0].goods_id,
      pay_type:2,
      goods_num: this.data.otherDt.goods_num,
      goods_attr_id: this.data.goodsInfo[0].id,
      address_id: this.data.prevPage.addressId,
      discount_id:"0",
      score:"0",
      total_fee: this.data.otherDt.total_fee,
      shipping_area_id: this.data.otherDt.shipping_info.shipping_id,
      shipping_name: this.data.otherDt.shipping_info.shipping_name,
      shipping_fee: this.data.otherDt.shipping_info.price,
      message:this.data.textAreaVal,
    };
    wx.showLoading({
      title: '提交中',
    });
    http('/goods/generate_goods_order',config).then( res => {
      console.log(res)
      wx.hideLoading();
      if(res.code == 1){

      }
    }).catch( err => {
      wx.hideLoading()
    })
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