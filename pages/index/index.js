// 婚姻状态评分系统 - 首页逻辑

const app = getApp();
const appConfig = require('../../utils/config.js');

Page({
  // 页面数据
  data: {
    title: appConfig.appName,
    subtitle: appConfig.appDescription
  },

  // 生命周期函数--监听页面加载
  onLoad() {
    console.log('首页加载');
  },

  onShow() {
    // 检查是否有未完成的评估
    const hasAnswers = Object.keys(app.globalData.userAnswers || {}).length > 0;
    
    if (hasAnswers) {
      console.log('检测到未完成的评估');
    }
  },

  // 开始评估按钮点击事件
  startAssessment() {
    console.log('开始评估');
    
    // 重置全局数据
    app.globalData.userAnswers = {};
    app.globalData.categoryScores = {};
    app.globalData.totalScore = 0;
    
    // 跳转到问卷页面
    wx.navigateTo({
      url: '/pages/questionnaire/questionnaire'
    });
  }
}) 