// 婚姻状态评分系统
const scoringSystem = {
  // 评分等级定义
  grades: [
    {
      grade: 'A',
      minScore: 90,
      maxScore: 100,
      description: '卓越婚姻',
      generalComment: '您的婚姻状态非常健康，双方在各个方面都有很好的互动和理解。这种婚姻关系为双方提供了强大的支持和满足感。'
    },
    {
      grade: 'B',
      minScore: 75,
      maxScore: 89.99,
      description: '良好婚姻',
      generalComment: '您的婚姻状态良好，双方在大多数方面都能有效沟通和合作。虽然有一些需要改进的地方，但总体上您的婚姻关系是健康的。'
    },
    {
      grade: 'C',
      minScore: 60,
      maxScore: 74.99,
      description: '稳定婚姻',
      generalComment: '您的婚姻状态稳定，但存在一些需要关注的问题。通过有意识地改进这些方面，您的婚姻关系可以变得更加健康和满足。'
    },
    {
      grade: 'D',
      minScore: 40,
      maxScore: 59.99,
      description: '需要关注的婚姻',
      generalComment: '您的婚姻状态需要更多关注和努力。有几个重要方面存在明显问题，建议寻求专业帮助或共同制定改进计划。'
    },
    {
      grade: 'E',
      minScore: 0,
      maxScore: 39.99,
      description: '高风险婚姻',
      generalComment: '您的婚姻状态处于高风险阶段，多个核心方面存在严重问题。强烈建议寻求专业婚姻咨询或治疗，以帮助解决这些问题。'
    }
  ],
  
  // 类别评分等级定义
  categoryGrades: [
    {
      grade: 'A',
      minScore: 4.5,
      maxScore: 5.0,
      description: '卓越',
      color: '#4CAF50'
    },
    {
      grade: 'B',
      minScore: 3.75,
      maxScore: 4.49,
      description: '良好',
      color: '#8BC34A'
    },
    {
      grade: 'C',
      minScore: 3.0,
      maxScore: 3.74,
      description: '一般',
      color: '#FFC107'
    },
    {
      grade: 'D',
      minScore: 2.0,
      maxScore: 2.99,
      description: '需改进',
      color: '#FF9800'
    },
    {
      grade: 'E',
      minScore: 1.0,
      maxScore: 1.99,
      description: '严重问题',
      color: '#F44336'
    }
  ],
  
  // 计算单个问题的分数
  calculateQuestionScore: function(rating) {
    // 将1-5的评分转换为0-100的分数
    return (rating - 1) * 25;
  },
  
  // 计算单个类别的分数
  calculateCategoryScore: function(questionScores) {
    if (questionScores.length === 0) return 0;
    
    // 计算平均分
    const sum = questionScores.reduce((total, score) => total + score, 0);
    return sum / questionScores.length;
  },
  
  // 计算总分
  calculateTotalScore: function(categoryScores) {
    if (Object.keys(categoryScores).length === 0) return 0;
    
    let totalScore = 0;
    let totalWeight = 0;
    
    // 计算加权平均分
    for (const category in categoryScores) {
      const { score, weight } = categoryScores[category];
      totalScore += score * weight;
      totalWeight += weight;
    }
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  },
  
  // 获取总分对应的等级
  getTotalGrade: function(totalScore) {
    for (const grade of this.grades) {
      if (totalScore >= grade.minScore && totalScore <= grade.maxScore) {
        return grade;
      }
    }
    return this.grades[this.grades.length - 1]; // 默认返回最低等级
  },
  
  // 获取类别分数对应的等级
  getCategoryGrade: function(categoryScore) {
    // 将0-100的分数转换为1-5的评分
    const rating = categoryScore / 20 + 1;
    
    for (const grade of this.categoryGrades) {
      if (rating >= grade.minScore && rating <= grade.maxScore) {
        return grade;
      }
    }
    return this.categoryGrades[this.categoryGrades.length - 1]; // 默认返回最低等级
  },
  
  // 生成类别建议的函数
  generateCategorySuggestion: function(categoryId, score) {
    // 这里将来会调用大模型API来生成建议
    // 目前先使用预设的建议
    const suggestions = {
      communication: {
        high: "您在沟通交流方面表现出色。继续保持开放、诚实的沟通方式，定期进行深入交流，分享彼此的想法和感受。",
        medium: "您的沟通状况良好，但仍有提升空间。尝试设定固定的'交流时间'，练习积极倾听，避免在情绪激动时讨论敏感话题。",
        low: "您的沟通方面存在明显问题。建议学习有效沟通技巧，如'我感受'陈述法，避免指责性语言，考虑在专业人士帮助下改善沟通模式。"
      },
      emotional_connection: {
        high: "您们之间的情感连接非常强。继续通过日常小事表达关爱，保持情感亲密度，定期回顾和庆祝你们的关系里程碑。",
        medium: "您的情感连接状况良好，但可以更深入。尝试增加表达爱意的方式，学习对方的爱之语言，创造更多共同的情感体验。",
        low: "您的情感连接需要加强。建议重新建立情感联系，分享内心感受，寻找重新点燃感情的方式，可能需要专业咨询师的指导。"
      },
      conflict_resolution: {
        high: "您在处理冲突方面表现出色。继续使用有效的冲突解决策略，保持尊重和理解，将分歧视为成长机会。",
        medium: "您的冲突解决能力良好，但有提升空间。学习识别冲突升级的早期信号，练习冷静期技巧，寻找双赢解决方案。",
        low: "您在冲突解决方面存在严重问题。建议学习健康的争吵规则，避免消极模式如批评、蔑视、防御和冷漠，考虑寻求专业调解。"
      },
      financial_management: {
        high: "您在财务管理方面配合默契。继续保持透明的财务沟通，定期审视和调整财务目标，共同规划长期财务未来。",
        medium: "您的财务管理状况良好，但可以更协调。建议制定更清晰的财务规划，讨论各自对金钱的态度和价值观，设立共同的财务目标。",
        low: "您在财务管理方面存在明显分歧。建议开诚布公地讨论财务状况，制定基本预算，考虑寻求财务顾问的专业建议。"
      },
      intimacy: {
        high: "您的亲密关系非常和谐。继续保持开放的沟通，探索彼此不断变化的需求和期望，保持亲密关系的新鲜感和满足感。",
        medium: "您的亲密关系状况良好，但有提升空间。尝试更坦诚地交流彼此的需求，创造更多亲密时刻，增加非性亲密接触。",
        low: "您的亲密关系需要关注。建议坦诚讨论各自的期望和需求，排除干扰亲密关系的因素，考虑寻求专业性治疗师的帮助。"
      },
      shared_values: {
        high: "您们在价值观方面高度一致。继续探索和分享彼此的深层价值观，共同参与体现这些价值观的活动，制定反映共同价值观的家庭传统。",
        medium: "您们在价值观上有一定共识，但也存在差异。尝试更深入地理解彼此的核心价值观，寻找价值观的共同点，尊重彼此的差异。",
        low: "您们在价值观上存在显著差异。建议找出最核心的共同价值观，学习尊重彼此的差异，在不违背自身原则的情况下寻找妥协点。"
      },
      family_relations: {
        high: "您们与双方家庭的关系处理得很好。继续维护健康的家庭边界，平衡与原生家庭的关系，共同参与家庭活动。",
        medium: "您们的家庭关系管理良好，但有改进空间。尝试建立更清晰的家庭边界，改善与特定家庭成员的互动，制定处理家庭压力的策略。",
        low: "您们在处理家庭关系方面存在困难。建议重新评估家庭边界，共同面对家庭冲突，必要时寻求家庭治疗的帮助。"
      },
      parenting: {
        high: "您们在育儿方面配合默契。继续保持一致的育儿理念，定期讨论孩子的发展需求，共同参与孩子的教育和成长。",
        medium: "您们的育儿协作良好，但有提升空间。尝试更频繁地讨论育儿策略，在孩子面前保持一致立场，平衡各自的育儿责任。",
        low: "您们在育儿方面存在明显分歧。建议制定基本的育儿规则，避免在孩子面前争论育儿问题，考虑寻求家庭教育专家的建议。"
      },
      leisure_activities: {
        high: "您们在休闲活动方面非常协调。继续探索新的共同兴趣，保持定期的约会时间，平衡共同活动和个人空间。",
        medium: "您们的休闲活动状况良好，但可以更丰富。尝试发现更多共同兴趣，安排固定的约会时间，相互支持各自的个人爱好。",
        low: "您们在休闲活动方面缺乏共同点。建议尝试新的活动类型，轮流选择约会活动，寻找能够同时满足双方的休闲方式。"
      },
      personal_growth: {
        high: "您们在支持彼此成长方面表现出色。继续鼓励彼此追求个人目标，庆祝彼此的成就，共同规划未来发展。",
        medium: "您们在个人成长方面的支持良好，但有提升空间。尝试更积极地参与彼此的个人发展，提供更具体的支持，尊重彼此的独立性。",
        low: "您们在支持个人成长方面存在问题。建议重新评估各自的个人目标，学习如何在不牺牲婚姻的情况下支持彼此的独立性，寻找平衡点。"
      }
    };
    
    let level;
    if (score >= 75) {
      level = 'high';
    } else if (score >= 50) {
      level = 'medium';
    } else {
      level = 'low';
    }
    
    return suggestions[categoryId][level];
  }
};

// 导出评分系统
if (typeof module !== 'undefined') {
  module.exports = { scoringSystem };
}
