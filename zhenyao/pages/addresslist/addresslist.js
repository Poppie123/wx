const {http} = require('../../utils/util.js')
// pages/addresslist/addresslist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddressList()
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
   * 获取地址数据
  */
  getAddressList(){
    wx.showLoading({
      title: '加载中',
    })
    http('/user/get_my_address').then(res => {
      wx.hideLoading();
      if(res.code == 1){
        let addressList = res.data.map(v => {
          v.status = v.status == 1;
          return v;
        });
         this.setData({
           addressList: addressList,
         })
      }
    }).catch( err => {
      wx.hideLoading()
    })
  },
  /**
   * 删除地址
  */
  deleteAddress(e){
    let addressId = e.currentTarget.dataset.id;
    let addressIdx = e.currentTarget.dataset.idx;
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success(res){
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
            icon: "none"
          })
          let addressList = this.data.addressList;
          http('/user/del_my_address', { address_id: addressId }).then(res => {
            wx.hideLoading()
            if (res.code == 1) {
              addressList.splice(addressIdx, 1);
              _this.setData({ addressList: addressList, });
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
   * 编辑地址
  */
  edieAddress(e){
    let addressId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/addressadd?addressId='+addressId,
    })

  },
  /**
   * 设置默认地址
  */
  radioChange(e){
    let idx = e.detail.value;
    wx.showLoading({
      title: '设置中',
    })
    http('/user/set_default_address', { address_id: this.data.addressList[idx].address_id}).then( res => {
      wx.hideLoading();
      if(res.code == 1){
         
      }else{
        
      }
    }).catch( err => {
      wx.hideLoading();
    })
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