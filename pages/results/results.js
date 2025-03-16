// 婚姻状态评分系统 - 结果页面逻辑

const app = getApp();
const appConfig = require('../../utils/config.js');

Page({
  // 页面数据
  data: {
    appConfig: appConfig, // 添加配置到页面数据中
    totalScore: 0,
    totalGrade: {},
    categoryScores: {},
    categoryGrades: {},
    categorySuggestions: {},
    categories: [],
    expandedCategories: {},
    radarChartData: [],
    radarChartWidth: 350,
    radarChartHeight: 350,
    useF2Chart: false, // 默认使用备用图表
    radarData: [],
    hasValidChartData: false,
    risks: [], // 风险因素列表
    showRisks: false, // 是否显示风险部分
    canvasWidth: 0, // 画布宽度
    canvasHeight: 0, // 画布高度
    qrCodePath: '../../images/qrcode.png' // 小程序二维码路径
  },

  // 生命周期函数--监听页面加载
  onLoad() {
    console.log('结果页面加载');
    
    // 获取系统信息，设置图表尺寸
    wx.getSystemInfo({
      success: (res) => {
        const windowWidth = res.windowWidth;
        const chartSize = windowWidth - 60; // 考虑页面边距
        
        this.setData({
          radarChartWidth: chartSize,
          radarChartHeight: chartSize,
          canvasWidth: windowWidth,
          canvasHeight: windowWidth * 1.5 // 设置画布高度为宽度的1.5倍，适合分享图片
        });
        
        console.log('设置图表尺寸:', chartSize);
      }
    });
    
    // 加载评分结果
    this.loadResults();
  },

  // 生命周期函数--监听页面显示
  onShow() {
    console.log('结果页面显示');
    
    // 检查数据是否完整，如果不完整则重新加载
    if (!this.data.totalScore || !this.data.categories || this.data.categories.length === 0) {
      console.log('数据不完整，重新加载');
      this.loadResults();
    } else {
      // 重新准备图表数据
      this.prepareChartData();
    }
  },
  
  // 生命周期函数--监听页面初次渲染完成
  onReady() {
    console.log('结果页面初次渲染完成');
    
    // 准备图表数据
    this.prepareChartData();
  },

  // 加载评分结果
  loadResults() {
    const scoring = require('../../utils/scoring');
    
    // 从全局数据获取评分结果
    const totalScore = app.globalData.totalScore || 0;
    const categoryScores = app.globalData.categoryScores || {};
    const categories = app.globalData.categories || [];
    
    console.log('加载评分结果:', totalScore, categoryScores, categories);
    
    // 获取总体评级
    const totalGrade = scoring.getTotalGrade(totalScore);
    
    // 获取各类别评级和建议
    const categoryGrades = {};
    const categorySuggestions = {};
    const expandedCategories = {};
    
    // 处理类别数据，确保包含权重信息
    const categoriesWithWeights = categories.map(category => {
      return {
        ...category,
        weight: category.weight || 1.0
      };
    });
    
    // 预处理分数数据，转换为整数
    const processedCategoryScores = {};
    for (const categoryId in categoryScores) {
      // 将分数四舍五入为整数
      processedCategoryScores[categoryId] = Math.round(categoryScores[categoryId]);
      
      const score = categoryScores[categoryId];
      categoryGrades[categoryId] = scoring.getCategoryGrade(score);
      categorySuggestions[categoryId] = scoring.getCategorySuggestion(score, categoryId);
      expandedCategories[categoryId] = false;
    }
    
    // 评估风险因素
    const risks = scoring.assessRisks(categoryScores);
    const showRisks = risks.length > 0;
    
    console.log('风险评估结果:', risks);
    
    // 更新页面数据
    this.setData({
      totalScore: Math.round(totalScore),
      totalGrade: totalGrade,
      categoryScores: processedCategoryScores, // 使用处理后的分数
      categoryGrades: categoryGrades,
      categorySuggestions: categorySuggestions,
      categories: categoriesWithWeights.filter(category => categoryScores[category.id] !== undefined),
      expandedCategories: expandedCategories,
      risks: risks,
      showRisks: showRisks
    });
    
    console.log('页面数据已更新，处理后的分数:', processedCategoryScores);
    
    // 准备图表数据
    this.prepareChartData();
  },

  // 准备图表数据
  prepareChartData() {
    // 获取所有有效的类别（包括已回答和已跳过的）
    const allCategories = app.globalData.categories || [];
    const userAnswers = app.globalData.userAnswers || {};
    const categoryScores = app.globalData.categoryScores || {};
    
    console.log('准备雷达图数据，用户回答:', userAnswers);
    
    // 构建雷达图数据，确保包含所有类别，即使是跳过的类别
    const radarData = allCategories.map(category => {
      // 获取用户对该类别的回答
      const answers = userAnswers[category.id];
      
      // 检查该类别是否被跳过
      const isSkipped = answers === 'skipped';
      
      // 获取类别评分，并四舍五入为整数
      const score = isSkipped ? 0 : Math.round(categoryScores[category.id] || 0);
      
      // 获取类别权重
      const weight = category.weight || 1.0;
      
      return {
        category: category.name,
        score: score,
        isSkipped: isSkipped,
        weight: weight
      };
    });
    
    console.log('雷达图数据(包含跳过的类别):', radarData);
    
    // 确保数据有效
    if (radarData.length === 0) {
      console.log('雷达图数据为空');
      return;
    }
    
    // 设置雷达图数据
    this.setData({
      radarChartData: radarData
    });
    
    console.log('雷达图组件数据已设置');
  },

  // 切换类别展开状态
  toggleCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    const expandedCategories = { ...this.data.expandedCategories };
    
    expandedCategories[categoryId] = !expandedCategories[categoryId];
    
    this.setData({
      expandedCategories: expandedCategories
    });
  },

  // 重新评估
  restartAssessment() {
    console.log('重新开始评估');
    
    // 显示确认对话框
    wx.showModal({
      title: '确认重新评估',
      content: '重新评估将清除当前的所有回答和结果，确定继续吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除全局数据
          app.globalData.userAnswers = {};
          app.globalData.categoryScores = {};
          app.globalData.totalScore = 0;
          
          // 返回首页
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      }
    });
  },

  // 分享结果
  shareResults() {
    console.log('分享结果');
    
    // 显示分享菜单
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    // 主动调用分享
    wx.showModal({
      title: '分享提示',
      content: '点击右上角"..."按钮，选择"转发"或"分享到朋友圈"',
      showCancel: false,
      confirmText: '我知道了'
    });
  },
  
  // 用于分享的小程序卡片
  onShareAppMessage() {
    return {
      title: `${appConfig.appName}：${this.data.totalScore}分，${this.data.totalGrade.description}`,
      path: '/pages/index/index',
      imageUrl: '' // 可以设置自定义分享图片
    };
  },
  
  // 用于分享到朋友圈
  onShareTimeline() {
    return {
      title: `${appConfig.appName}：${this.data.totalScore}分，${this.data.totalGrade.description}`,
      query: '',
      imageUrl: '' // 可以设置自定义分享图片
    };
  },
  
  // 下载结果图片
  downloadResultImage() {
    // 保存当前页面数据的备份
    const pageData = JSON.parse(JSON.stringify({
      totalScore: this.data.totalScore,
      totalGrade: this.data.totalGrade,
      categoryScores: this.data.categoryScores,
      categoryGrades: this.data.categoryGrades,
      categorySuggestions: this.data.categorySuggestions,
      categories: this.data.categories,
      expandedCategories: this.data.expandedCategories,
      radarChartData: this.data.radarChartData,
      risks: this.data.risks,
      showRisks: this.data.showRisks
    }));
    
    wx.showLoading({
      title: '生成图片中...',
    });
    
    // 动态计算画布高度
    // 基础高度 + 雷达图高度 + 每个类别的高度 + 风险部分高度(如果有) + 底部边距
    const baseHeight = 300; // 标题、总分等基础内容的高度
    const radarHeight = 300; // 雷达图部分的高度
    const categoryHeight = 180; // 每个类别的平均高度
    const categoriesCount = this.data.categories.length; // 类别数量
    const risksHeight = this.data.showRisks ? 250 : 0; // 风险部分的高度
    const bottomMargin = 80; // 底部边距
    
    // 计算总高度，根据实际内容计算
    let calculatedHeight = baseHeight + radarHeight + (categoryHeight * categoriesCount) + risksHeight + bottomMargin;
    
    console.log(`动态计算画布高度: ${calculatedHeight}px, 类别数量: ${categoriesCount}`);
    
    // 更新画布高度
    this.setData({
      canvasHeight: calculatedHeight
    });
    
    // 创建画布上下文
    const ctx = wx.createCanvasContext('resultCanvas');
    const canvasWidth = this.data.canvasWidth;
    const canvasHeight = calculatedHeight; // 使用计算出的高度
    const padding = 20;
    
    // 绘制白色背景
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 绘制标题
    ctx.setFillStyle('#333333');
    ctx.setFontSize(18);
    ctx.setTextAlign('center');
    ctx.fillText(appConfig.resultPageTitle, canvasWidth / 2, padding + 20);
    
    // 绘制总分
    const totalScore = this.data.totalScore;
    const totalGrade = this.data.totalGrade;
    
    // 绘制分数圆圈
    const circleRadius = 40;
    const circleX = canvasWidth / 2;
    const circleY = padding + 70;
    
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
    ctx.setFillStyle(totalGrade.color);
    ctx.fill();
    
    // 绘制分数文字
    ctx.setFillStyle('#ffffff');
    ctx.setFontSize(24);
    ctx.setTextAlign('center');
    ctx.fillText(totalScore, circleX, circleY + 8);
    
    // 绘制评级
    ctx.setFillStyle('#333333');
    ctx.setFontSize(16);
    ctx.fillText(`总体评级: ${totalGrade.grade} (${totalGrade.description})`, canvasWidth / 2, circleY + circleRadius + 30);
    
    // 绘制总体评价描述
    ctx.setFontSize(12);
    ctx.setTextAlign('left');
    
    // 处理长文本换行
    const wrapText = (text, x, y, maxWidth, lineHeight) => {
      if (!text) return y;
      
      // 限制最大行数
      const maxLines = 4;
      let currentLine = 1;
      
      const words = text.split('');
      let line = '';
      let testLine = '';
      let currentY = y;
      
      for (let i = 0; i < words.length; i++) {
        testLine += words[i];
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && i > 0) {
          ctx.fillText(line, x, currentY);
          line = words[i];
          testLine = words[i];
          currentY += lineHeight;
          
          // 检查是否达到最大行数
          currentLine++;
          if (currentLine > maxLines) {
            // 添加省略号并退出
            ctx.fillText(line + '...', x, currentY);
            return currentY + lineHeight;
          }
        } else {
          line = testLine;
        }
      }
      
      ctx.fillText(line, x, currentY);
      return currentY + lineHeight;
    };
    
    let currentY = circleY + circleRadius + 60;
    currentY = wrapText(totalGrade.longDescription, padding, currentY, canvasWidth - padding * 2, 18);
    
    // 绘制分割线
    currentY += 20;
    ctx.setStrokeStyle('#eeeeee');
    ctx.beginPath();
    ctx.moveTo(padding, currentY);
    ctx.lineTo(canvasWidth - padding, currentY);
    ctx.stroke();
    currentY += 30;
    
    // 绘制各维度评分标题
    ctx.setFillStyle('#333333');
    ctx.setFontSize(16);
    ctx.setTextAlign('center');
    ctx.fillText(appConfig.dimensionsTitle, canvasWidth / 2, currentY);
    currentY += 30;
    
    // 绘制雷达图
    const radarSize = Math.min(canvasWidth - padding * 2, 220); // 增加雷达图尺寸
    const radarX = canvasWidth / 2 - radarSize / 2;
    const radarY = currentY;
    
    // 绘制雷达图背景
    const radarCenterX = radarX + radarSize / 2;
    const radarCenterY = radarY + radarSize / 2;
    const radarRadius = radarSize / 2 * 0.7; // 减小雷达图半径，为标签留出更多空间
    
    // 绘制背景圆
    ctx.beginPath();
    ctx.arc(radarCenterX, radarCenterY, radarRadius, 0, Math.PI * 2);
    ctx.setStrokeStyle('#EEEEEE');
    ctx.setLineWidth(1);
    ctx.stroke();
    
    // 绘制内部圆
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(radarCenterX, radarCenterY, radarRadius * i / 5, 0, Math.PI * 2);
      ctx.setStrokeStyle('#EEEEEE');
      ctx.stroke();
    }
    
    // 获取雷达图数据
    const radarData = this.data.radarChartData || [];
    
    // 计算角度步长
    const angleStep = (Math.PI * 2) / radarData.length;
    
    // 绘制轴线和标签
    for (let i = 0; i < radarData.length; i++) {
      const angle = i * angleStep;
      const item = radarData[i];
      
      // 绘制轴线
      ctx.beginPath();
      ctx.moveTo(radarCenterX, radarCenterY);
      ctx.lineTo(
        radarCenterX + Math.cos(angle) * radarRadius,
        radarCenterY + Math.sin(angle) * radarRadius
      );
      ctx.setStrokeStyle('#DDDDDD');
      ctx.stroke();
      
      // 绘制标签
      const labelDistance = radarRadius + 25; // 增加标签距离
      const labelX = radarCenterX + Math.cos(angle) * labelDistance;
      const labelY = radarCenterY + Math.sin(angle) * labelDistance;
      
      // 根据角度调整文本对齐方式
      if (angle < Math.PI / 4 || angle > Math.PI * 7 / 4) { // 右侧
        ctx.setTextAlign('left');
      } else if (angle >= Math.PI * 3 / 4 && angle <= Math.PI * 5 / 4) { // 左侧
        ctx.setTextAlign('right');
      } else {
        ctx.setTextAlign('center');
      }
      
      if (angle >= 0 && angle <= Math.PI) { // 下半部分
        ctx.setTextBaseline('top');
      } else { // 上半部分
        ctx.setTextBaseline('bottom');
      }
      
      // 绘制类别名称
      ctx.setFontSize(10);
      ctx.setFillStyle('#666666');
      ctx.fillText(item.category, labelX, labelY);
      
      // 绘制分数
      const scoreText = item.isSkipped ? '(已跳过)' : `(${Math.round(item.score)})`;
      const scoreY = labelY + (angle >= 0 && angle <= Math.PI ? 20 : -20); // 增加分数与类别名称的间距，从15/15改为20/20
      
      ctx.setFontSize(9);
      ctx.setFillStyle(item.isSkipped ? '#999999' : '#4A90E2');
      ctx.fillText(scoreText, labelX, scoreY);
    }
    
    // 绘制数据区域
    if (radarData.length > 1) {
      ctx.beginPath();
      
      let firstDrawn = false;
      
      for (let i = 0; i < radarData.length; i++) {
        const item = radarData[i];
        if (!item.isSkipped) {
          const angle = i * angleStep;
          const score = item.score / 100; // 归一化
          const x = radarCenterX + Math.cos(angle) * radarRadius * score;
          const y = radarCenterY + Math.sin(angle) * radarRadius * score;
          
          if (!firstDrawn) {
            ctx.moveTo(x, y);
            firstDrawn = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      
      // 闭合路径
      ctx.closePath();
      
      // 填充区域
      ctx.setFillStyle('rgba(74, 144, 226, 0.3)');
      ctx.fill();
      
      // 绘制边框
      ctx.setStrokeStyle('#4A90E2');
      ctx.setLineWidth(2);
      ctx.stroke();
    }
    
    // 绘制数据点
    for (let i = 0; i < radarData.length; i++) {
      const item = radarData[i];
      const angle = i * angleStep;
      
      if (!item.isSkipped) {
        // 已回答类别的点
        const score = item.score / 100;
        const x = radarCenterX + Math.cos(angle) * radarRadius * score;
        const y = radarCenterY + Math.sin(angle) * radarRadius * score;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.setFillStyle('#4A90E2');
        ctx.fill();
        ctx.setLineWidth(1);
        ctx.setStrokeStyle('#FFFFFF');
        ctx.stroke();
      } else {
        // 跳过类别的点
        const x = radarCenterX + Math.cos(angle) * radarRadius * 0.1;
        const y = radarCenterY + Math.sin(angle) * radarRadius * 0.1;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.setFillStyle('#999999');
        ctx.fill();
        ctx.setLineWidth(1);
        ctx.setStrokeStyle('#CCCCCC');
        ctx.stroke();
      }
    }
    
    // 更新当前Y坐标
    currentY += radarSize + 65; // 增加间距，从40改为60
    
    // 绘制图例说明
    const legendY = currentY - 40; // 增加间距，从30改为40
    const legendItemWidth = 80;
    
    // 已回答图例
    ctx.setFillStyle('#4A90E2');
    ctx.fillRect(canvasWidth / 2 - legendItemWidth - 15, legendY, 10, 10);
    ctx.setFontSize(10);
    ctx.setTextAlign('left');
    ctx.setFillStyle('#666666');
    ctx.fillText(appConfig.legend.answered, canvasWidth / 2 - legendItemWidth + 0, legendY + 8);
    
    // 已跳过图例
    ctx.setFillStyle('#999999');
    ctx.fillRect(canvasWidth / 2 + 15, legendY, 10, 10);
    ctx.setFontSize(10);
    ctx.setTextAlign('left');
    ctx.setFillStyle('#666666');
    ctx.fillText(appConfig.legend.skipped, canvasWidth / 2 + 30, legendY + 8);
    
    // 绘制分割线
    ctx.setStrokeStyle('#eeeeee');
    ctx.beginPath();
    ctx.moveTo(padding, currentY - 10);
    ctx.lineTo(canvasWidth - padding, currentY - 10);
    ctx.stroke();
    currentY += 20; // 增加分割线后的间距
    
    // 绘制类别得分标题
    ctx.setFillStyle('#333333');
    ctx.setFontSize(16);
    ctx.setTextAlign('center');
    ctx.fillText(appConfig.detailedScoreTitle, canvasWidth / 2, currentY);
    currentY += 40; // 已经增加过的间距
    
    // 绘制类别得分
    ctx.setFontSize(14);
    ctx.setTextAlign('left');
    
    // 记录初始Y坐标，用于检查是否所有类别都已绘制
    const initialCategoryY = currentY;
    
    console.log(`开始绘制 ${this.data.categories.length} 个类别的详细评分`);
    
    this.data.categories.forEach((category, index) => {
      const score = this.data.categoryScores[category.id];
      const grade = this.data.categoryGrades[category.id];
      const suggestion = this.data.categorySuggestions[category.id];
      
      // 检查是否有足够空间绘制当前类别
      if (currentY + 80 > canvasHeight - 100) {
        console.log(`画布空间不足，无法绘制类别 ${index+1}/${categoriesCount}: ${category.name}`);
        return; // 跳过绘制剩余类别
      }
      
      console.log(`绘制类别 ${index+1}/${categoriesCount}: ${category.name}, Y坐标: ${currentY}`);
      
      // 绘制类别名称和分数
      ctx.setFillStyle('#333333');
      ctx.setFontSize(14);
      ctx.fillText(`${category.name}`, padding, currentY);
      
      // 绘制分数徽章
      const badgeText = `${score}`;
      const badgeWidth = ctx.measureText(badgeText).width + 20;
      const badgeX = canvasWidth - padding - badgeWidth;
      
      ctx.setFillStyle(grade.color);
      ctx.fillRect(badgeX, currentY - 14, badgeWidth, 20);
      
      ctx.setFillStyle('#ffffff');
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle'); // 设置文本基线为中间，使文本垂直居中
      ctx.fillText(badgeText, badgeX + badgeWidth / 2, currentY - 4); // 调整Y坐标使文本垂直居中
      ctx.setTextAlign('left');
      ctx.setTextBaseline('alphabetic'); // 恢复默认的文本基线
      
      currentY += 15; // 增加间距，从20改为30
      
      // 绘制进度条背景
      ctx.setFillStyle('#eeeeee');
      ctx.fillRect(padding, currentY, canvasWidth - padding * 2, 10);
      
      // 绘制进度条
      ctx.setFillStyle(grade.color);
      ctx.fillRect(padding, currentY, (score / 100) * (canvasWidth - padding * 2), 10);
      
      currentY += 30; // 增加间距，从15改为25
      
      // 绘制评级和描述
      ctx.setFillStyle('#666666');
      ctx.setFontSize(12);
      ctx.fillText(`评级: ${grade.grade} (${grade.description})`, padding, currentY);
      
      currentY += 25; // 增加间距，从15改为25
      
      // 绘制建议（换行处理）
      ctx.setFillStyle('#333333');
      ctx.setFontSize(11); // 减小字体
      // 限制建议文本长度，避免过长
      const maxSuggestionLength = 100;
      const shortenedSuggestion = suggestion.length > maxSuggestionLength ? 
        suggestion.substring(0, maxSuggestionLength) + '...' : suggestion;
      currentY = wrapText(shortenedSuggestion, padding, currentY, canvasWidth - padding * 2, 14);
      
      // 添加间隔
      currentY += 20; // 减少间距
    });
    
    // 检查是否所有类别都已绘制
    const drawnCategories = Math.round((currentY - initialCategoryY) / categoryHeight);
    console.log(`已绘制 ${drawnCategories}/${categoriesCount} 个类别`);
    if (drawnCategories < categoriesCount) {
      console.warn('部分类别未能绘制，画布高度可能不足');
    }
    
    // 如果有风险评估，绘制风险部分
    if (this.data.showRisks && this.data.risks.length > 0) {
      // 绘制分割线
      ctx.setStrokeStyle('#eeeeee');
      ctx.beginPath();
      ctx.moveTo(padding, currentY);
      ctx.lineTo(canvasWidth - padding, currentY);
      ctx.stroke();
      currentY += 30;
      
      // 绘制风险评估标题
      ctx.setFillStyle('#333333');
      ctx.setFontSize(16);
      ctx.setTextAlign('center');
      ctx.fillText(appConfig.riskAssessmentTitle, canvasWidth / 2, currentY);
      currentY += 20;
      
      // 绘制风险描述
      ctx.setFontSize(12);
      ctx.setTextAlign('left');
      ctx.setFillStyle('#666666');
      currentY = wrapText('以下是您婚姻关系中可能存在的风险因素，建议重点关注：', padding, currentY, canvasWidth - padding * 2, 16);
      currentY += 10;
      
      // 绘制风险项目
      this.data.risks.forEach((risk, index) => {
        // 绘制风险名称和分数
        ctx.setFillStyle('#333333');
        ctx.setFontSize(14);
        ctx.fillText(`${risk.name}`, padding, currentY);
        
        // 绘制分数
        ctx.setFillStyle('#666666');
        ctx.setFontSize(12);
        ctx.setTextAlign('right');
        ctx.fillText(`${risk.score}分`, canvasWidth - padding, currentY);
        ctx.setTextAlign('left');
        
        currentY += 20;
        
        // 绘制风险描述
        ctx.setFillStyle('#666666');
        ctx.setFontSize(12);
        currentY = wrapText(risk.description, padding, currentY, canvasWidth - padding * 2, 16);
        
        // 绘制建议
        ctx.setFillStyle('#333333');
        currentY = wrapText(`建议：${risk.suggestion}`, padding, currentY, canvasWidth - padding * 2, 16);
        
        // 添加间隔
        currentY += 15;
      });
    }
    
    // 绘制小程序二维码
    const qrSize = 80;
    const qrX = canvasWidth - qrSize - padding;
    
    // 二维码位置直接放在当前内容下方，不再使用画布底部
    const qrY = currentY + 20;
    
    ctx.drawImage(this.data.qrCodePath, qrX, qrY, qrSize, qrSize);
    
    // 绘制提示文字
    ctx.setFillStyle('#666666');
    ctx.setFontSize(12);
    ctx.setTextAlign('right');
    ctx.fillText(appConfig.qrCodeTip, qrX + qrSize - 5, qrY - 10);
    
    // 更新最终画布高度，确保包含二维码
    const finalHeight = qrY + qrSize + padding;
    
    // 重新设置画布高度为实际内容高度
    if (finalHeight !== calculatedHeight) {
      console.log(`调整画布最终高度: ${finalHeight}px (原计算高度: ${calculatedHeight}px)`);
      
      // 更新画布高度
      this.setData({
        canvasHeight: finalHeight
      });
      
      // 更新计算高度变量，保持一致性
      calculatedHeight = finalHeight;
    }
    
    // 完成绘制
    ctx.draw(true, () => {
      // 延迟保存图片，确保画布已经渲染完成
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'resultCanvas',
          success: (res) => {
            wx.hideLoading();
            
            // 保存图片到相册
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                // 恢复页面数据
                this.setData(pageData);
                
                // 不再重新加载评分结果，避免页面刷新
                // setTimeout(() => {
                //   this.loadResults();
                // }, 300);
                
                wx.showToast({
                  title: '图片已保存到相册',
                  icon: 'success'
                });
              },
              fail: (err) => {
                // 恢复页面数据
                this.setData(pageData);
                
                // 不再重新加载评分结果，避免页面刷新
                // setTimeout(() => {
                //   this.loadResults();
                // }, 300);
                
                console.error('保存图片失败:', err);
                wx.showToast({
                  title: '保存失败，请检查权限',
                  icon: 'none'
                });
              }
            });
          },
          fail: (err) => {
            // 恢复页面数据
            this.setData(pageData);
            
            // 不再重新加载评分结果，避免页面刷新
            // setTimeout(() => {
            //   this.loadResults();
            // }, 300);
            
            wx.hideLoading();
            console.error('生成图片失败:', err);
            wx.showToast({
              title: '生成图片失败',
              icon: 'none'
            });
          }
        });
      }, 500);
    });
  }
}) 