// 相守晴雨表 - 微信小程序

App({
  // 全局数据
  globalData: {
    userAnswers: {},
    categoryScores: {},
    totalScore: 0,
    categories: [],
    questions: {}
  },

  onLaunch() {
    // 加载问题和类别数据
    try {
      const categories = require('./utils/categories');
      const questions = require('./utils/questions');
      
      this.globalData.categories = categories;
      this.globalData.questions = questions;
      
      console.log('小程序启动成功', this.globalData.categories.length, Object.keys(this.globalData.questions).length);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  }
}) 