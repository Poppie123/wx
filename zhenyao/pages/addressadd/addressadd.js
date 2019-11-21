const {http} = require('../../utils/util.js')
// pages/addressadd/addressadd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    model:"add",  //页面模式   add 新增模式   edit 编辑模式
    modelId:"",  //该字段只有在编辑模式才存在值
    userName:"",
    userPhone:"",
    region: ['香港特别行政区', '香港特别行政区', '屯门区'],
    sexArr: [{ name: "男", checked: "false", }, { name: "女", checked: "true" }],
    regionId:[33,395,3370],
    allList:[],
    textValue:"", 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      model: options.addressId ? "edit" : "add",
      modelId: options.addressId || "",
    })
    options.addressId !== "" ? this.editModelInit() : "";
    this.getCountryList();
  },
  /**
   * 初始化编辑模式
  */
  editModelInit:function(){
    wx.showLoading({
      title: '加载中',
    })
    http('/user/get_edit_address_info', { address_id:this.data.modelId}).then( res => {
      wx.hideLoading();
      if(res.code == 1){
        this.setData({
          userName:res.data.name,
          userPhone:res.data.phone,
          textValue: res.data.address,
          regionId: [res.data.province, res.data.city, res.data.district],
        });
      }
    }).catch( err => {
      wx.hideLoading();
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
   * 获取全国省市区数据
  */
  getCountryList(){
    http('/user/area_list',{}).then(res => {
      this.setData({
        allList:res,
      })
    })
  },
  /**
   * 通过省市区，查找id
   * @param: arr {Array} 省市区数据
  */
  findSsq(arr,val,idx){
    if (idx == 3) return ""
    let id = "";
    val = val ? val.replace('省', "") : "";
    val = val ? val.replace('自治区', "") : "";
    val = val ? val.replace('特别行政区', "") : "";
    val = val ? val.replace('市', "") : "";
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (element.text == val) {
        id += element.value + ",";
        'children' in element ? id += this.findSsq(element.children, this.data.region[idx + 1], idx + 1) + "," : "";
        break;
      }
    }
    return id
  },
  /**
   * 省市区选择事件
  */
  bindRegionChange(e){
    var arr = e.detail.value;
    this.setData({
      region: arr,
    })
    var regionId = (this.findSsq(this.data.allList, arr[0], 0)).split(',').filter(v => v);
    this.setData({
      regionId: regionId,
    })
  },
  /**
   * 联系人改变事件
  */
  userNameChange(e){
    this.setData({
      userName:e.detail.value,
    })
  },
  userPhoneChange(e){
    this.setData({
      userPhone: e.detail.value,
    })
  },
  textValueChange(e){
    console.log(e)
    this.setData({
      textValue: e.detail.value,
    })
  },
  /**
   * 保存地址
  */
  saveAddress(){
    let config = {
       name:this.data.userName,
       phone:this.data.userPhone,
       province: this.data.regionId[0] || "",
       city:this.data.regionId[1] || "",
       district: this.data.regionId[2] || "",
       address:this.data.textValue,
       status:1,
       address_id:this.data.modelId || "",
    }
    if (config.name && config.phone && config.address){
      wx.showLoading({
        title: '保存中',
      })
      let reqUrl = this.data.modelId !== "" ? '/user/edit_my_address' : "/user/add_my_address";
      http(reqUrl,config).then(res => {
        wx.hideLoading()
        if(res.code == 1){
          wx.showToast({
            title: "保存成功",
          });
          setTimeout(()=>{
            wx.navigateBack()
          },700)
        }
      }).catch( err => {
        wx.hideLoading();
        wx.showToast({
          title: "保存失败",
          icon: "none"
        })
      })
    }else{
      wx.showToast({
        title: "请输入完整",
        icon:"none"
      })
    }
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