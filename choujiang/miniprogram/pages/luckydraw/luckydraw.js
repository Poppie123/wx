// pages/luckydraw/luckydraw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{ name: "5折券" },{ name: "一等奖" },{ name: "啤酒一箱" }, { name: "1折券" }, { name: "9折券" }, { name: "二等奖" }, { name: "江小白" }, { name: "霸王餐" }, { name: "五折券" }],
    currentIdx:0,
    isOk:false,
    zhongBox:false,
    zhongMsg:"",
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  // 生成随机数
  renderAllNum(str){
    let anum = (Math.floor(Math.random() * 2)) +3; //随机圈数(3-4)
    console.log(anum)
    let posti = 6;                      //中奖目标                     
    let allnum = str == "y" ? (anum * 8) + posti : (anum * 8) + (this.renderNonum(posti));
    console.log(allnum)
    return allnum;
  },
  renderNonum(posti){
    var num = (Math.floor(Math.random() * 8));
    if (num != posti){
      return num
    }else{
      this.renderNonum(posti)
    }
  },
  startChou(){
    this.setData({ currentIdx: 0 })
    //可以中奖
    var allNum = this.data.isOk ? this.renderAllNum('y') : this.renderAllNum('n');
    for (let i = 1; i < allNum; i++) {
      setTimeout(() => {
        var cindex = this.data.currentIdx;
        if (cindex == 0) {
          cindex = 1;
        } else if (cindex == 1) {
          cindex = 2;
        } else if (cindex == 2) {
          cindex = 5;
        } else if (cindex == 5) {
          cindex = 8
        } else if (cindex == 8) {
          cindex = 7
        } else if (cindex == 7) {
          cindex = 6
        } else if (cindex == 6) {
          cindex = 3
        } else if (cindex == 3) {
          cindex = 0
        }
        this.setData({ currentIdx: cindex })
        if (i == (allNum -1)){
          setTimeout(()=>{
            this.setData({
              zhongMsg:this.data.list[this.data.currentIdx].name,
              zhongBox:true,
            })
          },400)
        }
      }, (200 * i) - 100)
    }
  },
  //关闭中奖盒子
  closeZhongBox(){
    console.log(11)
    this.setData({
      zhongBox:false,
    })
  },
})