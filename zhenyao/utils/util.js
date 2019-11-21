var baseUrl = 'http://zhenyao.vfing.com:80/api';
var app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const http = (url, data) => new Promise((resolve,reject) => {
  let session_id = wx.getStorageSync('session_id') || "";
  wx.request({
    url: baseUrl + url, //仅为示例，并非真实的接口地址
    data: data,
    method: "post",
    header: {
      'content-type': 'application/json', // 默认值
      'Cookie': 'PHPSESSID=' + session_id, //携带存储id
    },
    success(res) {
      resolve(res.data)
    },
    fail(err) {
      reject(err)
    }
  })
})
const islogin = () =>{
  wx.getSetting({
    success: function (res) {
      if (res.authSetting['scope.userInfo']) {
        login();
      } else {
        wx.redirectTo({
          url: '/pages/logs/logs'
        })
      }
    }
  });
}
//小程序通过调用此代码进行登录@param1:isredirect(是否需要重定向。true将会重定向到首页)
const login = isredirect => {
  isredirect = isredirect || false;
  wx.login({
    success: res => {
      let code = res.code;
      // 获取到用户的 code 之后：res.code
      wx.getUserInfo({
        success: function (res) {
          let encryptedData = res.encryptedData;
          let iv = res.iv;
          app.globalData.userInfo = res.userInfo;
          wx.request({
            // 自行补上自己的 APPID 和 SECRET
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxac14c8fe7707aa7a&secret=f64d159b4d255e7f485b32aaba51ecb6&js_code=' + code + '&grant_type=authorization_code',
            success: res => {
              http('/user/decryptData', {
                encrypted_data: encryptedData,
                iv: iv,
                session_key: res.data.session_key,
                appid: "wxac14c8fe7707aa7a",
              }).then(res => {
                var prevDt = JSON.parse(res.data);
                wx.request({
                  url: baseUrl+'/user/wx_login', //仅为示例，并非真实的接口地址
                  data: {
                    openid: prevDt.unionId,
                    username: app.globalData.userInfo.nickName,
                    headimg: app.globalData.userInfo.avatarUrl,
                    sex: app.globalData.userInfo.gender,
                  },
                  success(res) {
                    console.log('登录成功')
                    var session_id = res.data.session_id;
                    wx.setStorageSync('session_id', res.data.session_id) //同步缓存存取session_id
                    if (isredirect) {
                      if(res.phone == null){  //绑定手机
                        wx.navigateTo({
                          url: "../bindphone/bindphone",
                        })
                      }else{
                        wx.switchTab({
                          url: '/pages/main/main'
                        })
                      }
                    }
                  }
                })
              })
            }
          });
        },
      })
    }
  });
}
//历史记录
let historyModel = {
  add(msg){
    let list = JSON.parse(this.getList());
    list.push(msg);
    wx.setStorageSync('history', JSON.stringify(list));
  },
  getList(){
    let list = wx.getStorageSync('history') || [];
    return list;
  },
  remove(){
    wx.clearStorage();
  }
}

//管理sessionID

module.exports = {
  formatTime,  //时间转换
  http,        //请求发送
  islogin,     //判断是否登录，如果没有登录，跳转授权界面，如果登录直接调用下边这个登录方法
  login,        //登录方法，请确保已经授权
  historyModel,
}
