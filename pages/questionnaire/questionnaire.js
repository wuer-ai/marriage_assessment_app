// 相守晴雨表 - 问卷页面逻辑

const app = getApp();
const appConfig = require('../../utils/config.js');

Page({
  // 页面数据
  data: {
    appConfig: appConfig, // 添加配置到页面数据中
    currentCategoryIndex: 0,
    currentCategory: null,
    questions: [],
    answers: [],
    progress: 0,
    skipCategory: false
  },

  // 生命周期函数--监听页面加载
  onLoad() {
    console.log('问卷页面加载');
    // 初始化问卷数据
    this.initQuestionnaire();
  },
  
  // 生命周期函数--监听页面显示
  onShow() {
    console.log('问卷页面显示');
    // 如果页面数据未初始化，重新初始化
    if (!this.data.currentCategory) {
      this.initQuestionnaire();
    }
  },

  // 初始化问卷数据
  initQuestionnaire() {
    const categories = app.globalData.categories;
    const questions = app.globalData.questions;
    
    console.log('初始化问卷数据:', categories && categories.length, questions && Object.keys(questions).length);
    
    if (!categories || categories.length === 0 || !questions || Object.keys(questions).length === 0) {
      console.error('数据未加载完成:', categories, questions);
      wx.showToast({
        title: '加载问题失败',
        icon: 'none'
      });
      
      // 如果数据未加载，延迟1秒后重试
      setTimeout(() => {
        this.initQuestionnaire();
      }, 1000);
      
      return;
    }
    
    // 设置当前类别和问题
    this.setCurrentCategory(0);
  },

  // 设置当前类别和问题
  setCurrentCategory(index) {
    const categories = app.globalData.categories;
    const questions = app.globalData.questions;
    
    if (index < 0 || index >= categories.length) {
      return;
    }
    
    const category = categories[index];
    const categoryQuestions = questions[category.id] || [];
    
    console.log('设置当前类别:', category.id, categoryQuestions.length);
    
    // 初始化答案数组
    const answers = new Array(categoryQuestions.length).fill(0);
    
    // 检查是否已跳过此类别
    let skipCategory = false;
    
    // 如果已有回答，则加载已有回答
    if (app.globalData.userAnswers && app.globalData.userAnswers[category.id]) {
      const savedAnswers = app.globalData.userAnswers[category.id];
      
      console.log(`加载类别 ${category.id} 的已有回答:`, savedAnswers);
      
      // 检查是否为跳过标记
      if (savedAnswers === 'skipped') {
        skipCategory = true;
        console.log(`加载已跳过的类别: ${category.id}`);
      } else {
        // 加载已保存的回答
        for (let i = 0; i < savedAnswers.length; i++) {
          if (i < answers.length) {
            answers[i] = savedAnswers[i];
          }
        }
      }
    }
    
    // 计算进度
    const progress = Math.floor((index / categories.length) * 100);
    
    // 更新页面数据
    this.setData({
      currentCategoryIndex: index,
      currentCategory: category,
      questions: categoryQuestions,
      answers: answers,
      progress: progress,
      skipCategory: skipCategory
    });
    
    console.log('设置当前类别完成:', {
      categoryId: category.id,
      skipCategory: skipCategory,
      answers: answers
    });
  },

  // 选择答案
  selectAnswer(e) {
    const { questionIndex, value } = e.currentTarget.dataset;
    const answers = [...this.data.answers];
    
    answers[questionIndex] = parseInt(value);
    
    this.setData({
      answers: answers
    });
  },

  // 切换跳过类别
  toggleSkipCategory(e) {
    this.setData({
      skipCategory: e.detail.value.includes('skip')
    });
  },

  // 上一步
  prevCategory() {
    console.log('上一步前的状态:', {
      categoryId: this.data.currentCategory.id,
      skipCategory: this.data.skipCategory
    });
    
    // 保存当前类别的回答，但不进行完整性检查
    this.saveCurrentAnswersWithoutValidation();
    
    // 切换到上一个类别
    const prevIndex = this.data.currentCategoryIndex - 1;
    if (prevIndex >= 0) {
      this.setCurrentCategory(prevIndex);
      
      console.log('上一步后的状态:', {
        categoryId: this.data.currentCategory.id,
        skipCategory: this.data.skipCategory,
        savedAnswers: app.globalData.userAnswers[this.data.currentCategory.id]
      });
    }
  },

  // 下一步
  nextCategory() {
    // 保存当前类别的回答
    if (this.saveCurrentAnswers()) {
      // 切换到下一个类别
      const nextIndex = this.data.currentCategoryIndex + 1;
      const categories = app.globalData.categories;
      
      if (nextIndex < categories.length) {
        this.setCurrentCategory(nextIndex);
      } else {
        // 完成问卷，计算得分
        this.calculateScores();
        
        // 跳转到结果页面
        wx.navigateTo({
          url: '/pages/results/results'
        });
      }
    }
  },

  // 保存当前类别的回答（不进行验证）
  saveCurrentAnswersWithoutValidation() {
    const category = this.data.currentCategory;
    const answers = this.data.answers;
    const skipCategory = this.data.skipCategory;
    
    console.log('保存当前回答(不验证):', {
      categoryId: category ? category.id : 'undefined',
      skipCategory: skipCategory,
      answers: answers
    });
    
    if (!category) {
      return;
    }
    
    // 确保全局变量已初始化
    if (!app.globalData.userAnswers) {
      app.globalData.userAnswers = {};
    }
    
    // 如果跳过此类别，则标记该类别为已跳过
    if (skipCategory) {
      // 使用特殊标记表示已跳过的类别
      app.globalData.userAnswers[category.id] = 'skipped';
      console.log(`类别 ${category.id} 已跳过`);
    } else {
      // 保存当前回答，即使不完整
      app.globalData.userAnswers[category.id] = [...answers];
      console.log(`类别 ${category.id} 的回答已保存(不完整):`, answers);
    }
    
    // 打印保存后的状态
    console.log('保存后的userAnswers:', JSON.stringify(app.globalData.userAnswers));
  },

  // 保存当前类别的回答
  saveCurrentAnswers() {
    const category = this.data.currentCategory;
    const answers = this.data.answers;
    const skipCategory = this.data.skipCategory;
    
    if (!category) {
      return false;
    }
    
    // 确保全局变量已初始化
    if (!app.globalData.userAnswers) {
      app.globalData.userAnswers = {};
    }
    
    // 如果跳过此类别，则标记该类别为已跳过
    if (skipCategory) {
      // 使用特殊标记表示已跳过的类别，而不是删除
      app.globalData.userAnswers[category.id] = 'skipped';
      console.log(`类别 ${category.id} 已跳过`);
      return true;
    } else {
      // 检查是否所有问题都已回答
      const allAnswered = answers.every(answer => answer > 0);
      
      if (!allAnswered) {
        wx.showToast({
          title: '请回答所有问题',
          icon: 'none'
        });
        return false;
      }
      
      // 保存回答
      app.globalData.userAnswers[category.id] = [...answers];
      console.log(`类别 ${category.id} 的回答已保存:`, answers);
      return true;
    }
  },

  // 计算得分
  calculateScores() {
    const scoring = require('../../utils/scoring');
    const categories = app.globalData.categories;
    const questions = app.globalData.questions;
    const userAnswers = app.globalData.userAnswers;
    
    // 计算各类别得分
    const categoryScores = {};
    
    for (const categoryId in userAnswers) {
      const answers = userAnswers[categoryId];
      
      // 跳过已标记为跳过的类别
      if (answers === 'skipped') {
        console.log(`类别 ${categoryId} 已跳过，不计算得分`);
        continue;
      }
      
      const categoryQuestions = questions[categoryId] || [];
      const score = scoring.calculateCategoryScore(answers, categoryQuestions);
      categoryScores[categoryId] = score;
      console.log(`类别 ${categoryId} 的得分:`, score);
    }
    
    // 计算总得分
    const totalScore = scoring.calculateTotalScore(categoryScores, categories);
    console.log('总得分:', totalScore);
    
    // 保存得分
    app.globalData.categoryScores = categoryScores;
    app.globalData.totalScore = totalScore;
  }
}) 