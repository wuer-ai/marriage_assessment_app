/**
 * 小程序全局配置
 * 集中管理应用程序的关键配置信息，方便后续修改
 */

const appConfig = {
  // 应用名称
  appName: '相守晴雨站',
  
  // 应用描述
  appDescription: '评估和改善伴侣关系的健康状况',
  
  // 分享信息
  shareTitle: '我在相守晴雨站完成了关系评估，快来看看吧！',
  
  // 结果页面标题
  resultPageTitle: '关系健康评估结果',
  
  // 各维度评分标题
  dimensionsTitle: '各维度评分',
  
  // 详细评分标题
  detailedScoreTitle: '详细评分',
  
  // 风险评估标题
  riskAssessmentTitle: '风险评估',
  
  // 二维码提示文字
  qrCodeTip: '扫描二维码进行评估',
  
  // 按钮文字
  buttons: {
    shareResults: '分享结果',
    restartAssessment: '重新评估',
    downloadImage: '下载结果图片'
  },
  
  // 图例文字
  legend: {
    answered: '已回答',
    skipped: '已跳过'
  }
};

module.exports = appConfig; 