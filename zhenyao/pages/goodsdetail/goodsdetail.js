const {http} = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
// pages/goodsdetail/goodsdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"", //详情id
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    gdsDtl:{},     //商品详情
    shopDtl:{},    //店铺详情
    allBuyList:[], //大家都在买
    goodsNum:1,    //商品购买数量
    allPrice:0,    //商品总价
    isCollect:false, //是否收藏
    guigeBox:false,  //规格弹窗
    currentGuigeIdx:0,     //当前规格下标
    currentGuigeItem:{},//当前规格内容
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      id:options.id,
    });
    this.getGdsDetail();
    this.getAllBuy();
  },
  /**
   * 获取商品详情
  */
  getGdsDetail(){
    http('/goods/get_goods_detail',{id:this.data.id}).then(res=>{
      wx.hideLoading()
      if(res.code == 1){
        this.setData({
          gdsDtl:res.data,
          currentGuigeItem: res.data.attribute[0],
          allPrice: res.data.attribute[0].price,
        });
        this.getPinpai(res.data.goods_addr_id); //获取品牌
        WxParse.wxParse('article', 'html', res.data.detail, this, 0); //处理富文本
      }
    });
  },
  /**
   * 获取品牌
   * @param:id {String};//goods_addr_id
  */
  getPinpai(id){
    http('/goods/get_brand_goods',{
      brand_id:id,
      sort_type: 1,
      start: 0
    }).then(res => {
      if(res.code == 1){
         this.setData({
           shopDtl:res.data,
         })
      }
    })
  },
  /**
   * 获取大家都在买
  */
  getAllBuy(){
    http('/goods/search_hot', { price_order:1,start:0}).then(res => {
      if(res.code == 1){
        this.setData({
          allBuyList:res.data,
        })
      }
    })
  },
  /**
   * 商品数量增加
  */
  addGdsNum(){
    console.log()
    this.setData({
      goodsNum:this.data.goodsNum + 1,
    });
    this.computedAllPrice();
  },
  /**
   * 商品数量减少
  */
  reduceGdsNum(){
    this.setData({
      goodsNum: this.data.goodsNum - 1 == 0 ? 1 : this.data.goodsNum - 1,
    });
    this.computedAllPrice();
  },
  /**
   *计算总价 
  */ 
  computedAllPrice(){
    this.setData({
      allPrice: Number(this.data.goodsNum) * Number(this.data.currentGuigeItem.price),
    });
  },
  /**
   * 商品收藏
  */
  collectGds(){
    http('/goods/goods_collect', { goods_id: this.data.id }).then(res => {
      if (res.code == 1) {
        this.setData({
          isCollect: !this.data.isCollect,
        })
        wx.showToast({ title: "收藏成功",icon:'none'})
      }else{
        wx.showToast({ title: "收藏失败",icon:'none'})
      }
    })
  },
  /**
   * 打开规格弹窗
  */
  openGuigeBox(){
    this.setData({
      guigeBox:true,
    })
  },
  /**
   * 关闭规格弹窗
  */
  closeGuigeBox(){
    this.setData({
      guigeBox: false,
    })
  },
  /**
   * 规格切换事件
  */
  changeGuige(e){
    var currentidx = e.currentTarget.dataset.idx;
    this.setData({
      currentGuigeIdx: currentidx,
      currentGuigeItem: this.data.gdsDtl.attribute[currentidx],
    })
    this.computedAllPrice();
  },
  /**
   * 加入购物车
  */
  addCar(){
    if (this.data.guigeBox){
      http('/app/add_goods_cart',{
        goods_id:this.data.id,
        goods_name: this.data.gdsDtl.goods_name,
        goods_attr_id:this.data.currentGuigeItem.id,
        goods_attr_value: this.data.currentGuigeItem.attr,
        goods_num: this.data.goodsNum,
        shop_price: this.data.currentGuigeItem.price,
      }).then(res => {
        if(res.code == 1){
          wx.showToast({title:'添加成功',icon:"none"});
          this.closeGuigeBox(); //关闭规格
        }else{
          wx.showToast({ title: '添加失败', icon: "none" });
        }
      })
    }else{
      this.setData({
        guigeBox:true,
      })
    }
  },
  /**
   * 下单流程
  */
  getToOrder(){
    if (this.data.guigeBox) {
      wx.showLoading({
        title: '请稍等',
      })
      http('/user/get_my_address').then(res => {
        wx.hideLoading();
        if (res.code == 1) {
          let addressId = (res.data.filter(v => v.status == 1))[0].address_id; //收货地址id
          let goodsId = this.data.id;  //商品id
          let goodsAttrId = this.data.currentGuigeItem.id;
          let goodsNum = this.data.goodsNum;
          wx.navigateTo({
            url: '/pages/submitorder/submitorder?addressId=' + addressId + '&goodsId=' + goodsId + "&goodsAttrId=" + goodsAttrId + "&goodsNum=" + goodsNum,
          })
        }else{
          wx.showToast({
            title: '请添加默认收货地址',
            icon:"none",
          })
        }
      }).catch( err => {
        wx.hideLoading();
      })
    } else {
      this.setData({
        guigeBox: true,
      })
    }
  },
  /**
   * 跳转品牌主页
  */
  linkPinpai(){
    let id = this.data.gdsDtl.goods_addr_id;
    wx.navigateTo({
      url: '../pinpai/pinpai?id=' + id,
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