const reqbeg = (name,data) => {
  return new Promise((resolve,reject) => {
    wx.cloud.callFunction({
      name: name,
      data: data,
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        resolve(res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        reject(err)
      }
    })
  })
}
export {
  reqbeg,
}