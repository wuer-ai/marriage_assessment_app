// 相守晴雨表 - 评分工具函数

/**
 * 计算类别得分
 * @param {Array} answers - 用户对该类别问题的回答
 * @param {Array} categoryQuestions - 该类别的问题数据，包含权重
 * @returns {number} - 类别得分（0-100）
 */
function calculateCategoryScore(answers, categoryQuestions) {
  if (!answers || answers.length === 0) {
    return 0;
  }
  
  // 如果没有提供问题数据（包含权重），则使用默认权重1.0
  if (!categoryQuestions) {
    // 计算平均分
    const sum = answers.reduce((total, answer) => total + answer, 0);
    const average = sum / answers.length;
    
    // 转换为0-100分
    return (average - 1) * 25;
  }
  
  // 使用权重计算加权平均分
  let weightSum = 0;
  let scoreSum = 0;
  
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const weight = categoryQuestions[i] ? categoryQuestions[i].weight || 1.0 : 1.0;
    
    weightSum += weight;
    scoreSum += ((answer - 1) * 25) * weight; // 转换为0-100分后再乘以权重
  }
  
  return weightSum > 0 ? scoreSum / weightSum : 0;
}

/**
 * 计算总得分
 * @param {Object} categoryScores - 各类别得分
 * @param {Array} categories - 类别数据
 * @returns {number} - 总得分（0-100）
 */
function calculateTotalScore(categoryScores, categories) {
  // 过滤出有效的类别（已回答且有得分的类别）
  const validCategories = categories.filter(category => 
    categoryScores[category.id] !== undefined && 
    categoryScores[category.id] !== null &&
    categoryScores[category.id] !== 'skipped'
  );
  
  if (validCategories.length === 0) {
    console.log('没有有效的类别得分，总分为0');
    return 0;
  }
  
  // 计算加权平均分
  let weightSum = 0;
  let scoreSum = 0;
  
  validCategories.forEach(category => {
    const weight = category.weight || 1.0;
    const score = categoryScores[category.id];
    
    weightSum += weight;
    scoreSum += score * weight;
    
    console.log(`类别 ${category.id} 权重: ${weight}, 得分: ${score}, 加权得分: ${score * weight}`);
  });
  
  const totalScore = weightSum > 0 ? scoreSum / weightSum : 0;
  console.log(`总权重: ${weightSum}, 总加权得分: ${scoreSum}, 最终总分: ${totalScore}`);
  
  return totalScore;
}

/**
 * 获取类别评级
 * @param {number} score - 类别得分
 * @returns {Object} - 评级信息
 */
function getCategoryGrade(score) {
  if (score >= 90) {
    return {
      grade: 'A',
      description: '卓越',
      color: '#4CAF50'
    };
  } else if (score >= 75) {
    return {
      grade: 'B',
      description: '良好',
      color: '#8BC34A'
    };
  } else if (score >= 60) {
    return {
      grade: 'C',
      description: '一般',
      color: '#FFC107'
    };
  } else if (score >= 40) {
    return {
      grade: 'D',
      description: '需改进',
      color: '#FF9800'
    };
  } else {
    return {
      grade: 'E',
      description: '严重问题',
      color: '#F44336'
    };
  }
}

/**
 * 获取总体评级
 * @param {number} score - 总得分
 * @returns {Object} - 评级信息
 */
function getTotalGrade(score) {
  if (score >= 90) {
    return {
      grade: 'A',
      description: '卓越婚姻',
      longDescription: '您的婚姻关系非常健康，各方面都表现出色。继续保持良好的沟通和情感连接，定期检视婚姻状况，共同成长。',
      color: '#4CAF50'
    };
  } else if (score >= 75) {
    return {
      grade: 'B',
      description: '良好婚姻',
      longDescription: '您的婚姻关系健康，大多数方面表现良好。关注评分较低的领域，继续加强沟通和理解，共同努力使婚姻更加美满。',
      color: '#8BC34A'
    };
  } else if (score >= 60) {
    return {
      grade: 'C',
      description: '稳定婚姻',
      longDescription: '您的婚姻关系基本稳定，但有改进空间。重点关注评分较低的领域，增加沟通和理解，共同解决问题，提升婚姻质量。',
      color: '#FFC107'
    };
  } else if (score >= 40) {
    return {
      grade: 'D',
      description: '需要关注的婚姻',
      longDescription: '您的婚姻关系存在一些问题，需要重点关注。建议认真讨论评分较低的领域，考虑寻求专业婚姻咨询帮助，共同努力改善关系。',
      color: '#FF9800'
    };
  } else {
    return {
      grade: 'E',
      description: '高风险婚姻',
      longDescription: '您的婚姻关系面临严重挑战，多个领域存在问题。强烈建议寻求专业婚姻咨询或治疗帮助，共同制定改善计划，重建健康关系。',
      color: '#F44336'
    };
  }
}

/**
 * 获取类别建议
 * @param {number} score - 类别得分
 * @param {string} categoryId - 类别ID
 * @returns {string} - 建议内容
 */
function getCategorySuggestion(score, categoryId) {
  const suggestions = {
    communication: {
      high: '您在沟通方面表现出色。继续保持开放、诚实的交流，定期安排深入交谈的时间，分享彼此的想法和感受。',
      medium: '您的沟通可以进一步改善。尝试设定"无干扰"的交谈时间，练习积极倾听，确认理解对方的观点，避免在情绪激动时讨论敏感话题。',
      low: '您的沟通存在明显问题。建议学习有效沟通技巧，如"我"陈述句，避免指责和防御，考虑在专业人士帮助下改善沟通模式。'
    },
    emotional_connection: {
      high: '您在情感连接方面表现出色。继续表达爱意和欣赏，关注彼此的情感需求，共同经历生活中的喜悦和挑战。',
      medium: '您的情感连接可以进一步加强。增加表达爱意和感谢的频率，学习识别和回应伴侣的情感需求，创造共同的情感体验。',
      low: '您的情感连接存在明显问题。建议重新建立情感联系，学习表达和接收爱的方式，考虑在专业人士帮助下探索情感障碍的根源。'
    },
    conflict_resolution: {
      high: '您在冲突解决方面表现出色。继续以尊重和理解的态度处理分歧，寻求双方都能接受的解决方案，从冲突中学习和成长。',
      medium: '您的冲突解决方式可以改善。学习在冲突中保持冷静，聚焦于问题而非人，寻求共赢的解决方案，避免旧事重提。',
      low: '您的冲突解决存在严重问题。建议学习健康的冲突管理技巧，避免有害的沟通模式，考虑在专业人士帮助下改变冲突互动方式。'
    },
    financial_management: {
      high: '您在财务管理方面表现出色。继续保持透明的财务沟通，定期审视和调整财务目标，共同做出重要的财务决策。',
      medium: '您的财务管理可以改善。建立定期的财务会议，讨论收支和预算，制定共同的财务目标，尊重彼此的财务观点和习惯。',
      low: '您的财务管理存在明显问题。建议寻求财务顾问帮助，建立透明的财务系统，解决财务分歧，制定共同认可的财务规则。'
    },
    intimacy: {
      high: '您在亲密关系方面表现出色。继续保持开放的沟通，表达需求和喜好，尊重彼此的界限，保持亲密关系的新鲜感。',
      medium: '您的亲密关系可以改善。增加关于亲密需求和期望的沟通，创造浪漫和亲密的时刻，学习理解和满足彼此的需求。',
      low: '您的亲密关系存在明显问题。建议坦诚讨论亲密关系中的障碍，考虑寻求专业性治疗师的帮助，共同解决亲密关系中的困难。'
    },
    shared_values: {
      high: '您在共同价值观方面表现出色。继续探讨和尊重彼此的核心价值观，共同制定未来目标，在重要决策上保持一致。',
      medium: '您可以进一步探索和理解彼此的价值观。定期讨论人生目标和优先事项，寻找价值观的共同点，尊重彼此的差异。',
      low: '您在价值观方面存在明显分歧。建议深入探讨各自的核心价值观和信仰，寻找可能的妥协和共识，考虑在专业人士帮助下处理价值观冲突。'
    },
    family_relations: {
      high: '您在家庭关系方面表现出色。继续维护与双方家庭的健康界限，共同应对家庭挑战，支持彼此与原生家庭的关系。',
      medium: '您的家庭关系可以改善。讨论与双方家庭互动的期望和界限，作为一个团队应对家庭挑战，尊重彼此的家庭背景和传统。',
      low: '您的家庭关系存在明显问题。建议设立清晰的家庭界限，改善与双方家庭的沟通方式，考虑在专业人士帮助下处理复杂的家庭动态。'
    },
    parenting: {
      high: '您在育儿协作方面表现出色。继续保持一致的育儿理念，共同分担育儿责任，支持彼此的育儿决定，定期讨论孩子的发展和需求。',
      medium: '您的育儿协作可以改善。增加关于育儿理念和方法的沟通，在孩子面前保持一致，平衡育儿责任，共同解决育儿挑战。',
      low: '您的育儿协作存在明显问题。建议寻求家庭治疗或育儿专家的帮助，建立共同的育儿计划，解决育儿分歧，学习有效的共同育儿策略。'
    },
    leisure_activities: {
      high: '您在休闲活动方面表现出色。继续探索共同的兴趣爱好，定期安排有质量的共处时间，创造新的共同体验和回忆。',
      medium: '您可以增加共同的休闲活动。寻找双方都感兴趣的活动，定期安排约会和特别活动，平衡共同时间和个人空间。',
      low: '您在休闲活动方面存在明显不足。建议重新发现或创造共同兴趣，优先安排共处时间，尝试新的活动类型，建立共同的休闲传统。'
    },
    personal_growth: {
      high: '您在支持个人成长方面表现出色。继续鼓励彼此追求个人目标，尊重个人空间和独立性，共同适应彼此的成长和变化。',
      medium: '您可以进一步支持彼此的个人成长。更积极地表达对伴侣目标的支持，尊重个人空间和兴趣，学习如何在保持亲密的同时允许个人发展。',
      low: '您在支持个人成长方面存在明显问题。建议重新评估个人目标和婚姻期望，学习平衡个人需求和关系需求，考虑在专业人士帮助下解决个人成长与婚姻的冲突。'
    }
  };
  
  if (score >= 75) {
    return suggestions[categoryId].high;
  } else if (score >= 50) {
    return suggestions[categoryId].medium;
  } else {
    return suggestions[categoryId].low;
  }
}

/**
 * 评估婚姻风险
 * @param {Object} categoryScores - 各类别得分
 * @returns {Array} - 风险因素列表，包含风险类别、程度和建议
 */
function assessRisks(categoryScores) {
  const risks = [];
  const riskThreshold = 40; // 低于此分数视为风险
  const highRiskThreshold = 25; // 低于此分数视为高风险
  
  // 风险类别描述
  const riskDescriptions = {
    communication: {
      name: '沟通问题',
      description: '沟通不畅可能导致误解增加、情感疏远和冲突升级',
      suggestion: '建立定期沟通的习惯，学习积极倾听技巧，考虑参加沟通技巧工作坊'
    },
    emotional_connection: {
      name: '情感疏离',
      description: '情感连接不足可能导致孤独感、不被理解和婚姻满意度下降',
      suggestion: '增加情感表达，创造共同的情感体验，学习识别和回应伴侣的情感需求'
    },
    conflict_resolution: {
      name: '冲突处理不当',
      description: '不健康的冲突模式可能导致长期怨恨、关系恶化和情感伤害',
      suggestion: '学习健康的冲突解决技巧，避免批评、防御、蔑视和冷漠等有害行为'
    },
    financial_management: {
      name: '财务矛盾',
      description: '财务分歧和管理不善可能导致信任危机和持续的关系压力',
      suggestion: '建立透明的财务沟通机制，制定共同的财务目标和规则'
    },
    intimacy: {
      name: '亲密关系问题',
      description: '亲密关系不和谐可能导致不满足感、拒绝感和关系疏远',
      suggestion: '坦诚讨论亲密需求和期望，寻求专业性健康咨询'
    },
    shared_values: {
      name: '价值观冲突',
      description: '核心价值观的显著差异可能导致重大决策困难和长期不和谐',
      suggestion: '探索和理解彼此的价值观，寻找共同点，学习尊重差异'
    },
    family_relations: {
      name: '家庭关系紧张',
      description: '与原生家庭的关系问题可能给婚姻带来外部压力和冲突',
      suggestion: '设立健康的家庭界限，作为一个团队应对家庭挑战'
    },
    parenting: {
      name: '育儿分歧',
      description: '育儿理念和实践的不一致可能导致家庭冲突和对孩子的负面影响',
      suggestion: '制定共同的育儿计划，寻求育儿专家的建议'
    },
    leisure_activities: {
      name: '共同时间不足',
      description: '缺乏有质量的共处时间可能导致情感疏远和婚姻满意度下降',
      suggestion: '优先安排共同活动，发现或创造共同兴趣'
    },
    personal_growth: {
      name: '个人成长受限',
      description: '不支持个人发展可能导致怨恨、自我价值感降低和关系不平衡',
      suggestion: '学习平衡个人需求和关系需求，支持彼此的个人目标'
    }
  };
  
  // 评估各类别风险
  for (const categoryId in categoryScores) {
    const score = categoryScores[categoryId];
    
    // 跳过已标记为跳过的类别
    if (score === 'skipped') {
      continue;
    }
    
    // 检查是否低于风险阈值
    if (score < riskThreshold) {
      const riskInfo = riskDescriptions[categoryId];
      if (riskInfo) {
        risks.push({
          categoryId: categoryId,
          name: riskInfo.name,
          description: riskInfo.description,
          suggestion: riskInfo.suggestion,
          level: score < highRiskThreshold ? 'high' : 'medium',
          score: score
        });
      }
    }
  }
  
  // 按风险程度排序（高风险在前）
  risks.sort((a, b) => {
    if (a.level === b.level) {
      return a.score - b.score; // 分数低的风险更大
    }
    return a.level === 'high' ? -1 : 1;
  });
  
  return risks;
}

// 导出函数
module.exports = {
  calculateCategoryScore,
  calculateTotalScore,
  getCategoryGrade,
  getTotalGrade,
  getCategorySuggestion,
  assessRisks
}; 