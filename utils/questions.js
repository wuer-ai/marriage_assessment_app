// 婚姻状态评分问卷问题 - 精简版
const marriageQuestions = {
  communication: [
    {
      id: 'comm_1',
      text: '我们能够轻松地讨论日常生活中的事情',
      weight: 1.8
    },
    {
      id: 'comm_2',
      text: '当我们有不同意见时，我们能够平静地交流',
      weight: 2.2
    },
    {
      id: 'comm_3',
      text: '我们能够讨论敏感话题而不引起争吵',
      weight: 1.5
    }
  ],
  emotional_connection: [
    {
      id: 'emot_1',
      text: '我感到我的伴侣理解我的情感需求',
      weight: 2.0
    },
    {
      id: 'emot_2',
      text: '当我情绪低落时，我的伴侣能够给予我支持',
      weight: 1.7
    },
    {
      id: 'emot_3',
      text: '我感到我们之间有深厚的情感联系',
      weight: 2.3
    }
  ],
  conflict_resolution: [
    {
      id: 'conf_1',
      text: '我们能够有效地解决分歧',
      weight: 2.5
    },
    {
      id: 'conf_2',
      text: '争吵后，我们能够和解并继续前进',
      weight: 2.0
    },
    {
      id: 'conf_3',
      text: '我们避免在争吵中使用伤害性的言语',
      weight: 1.8
    }
  ],
  financial_management: [
    {
      id: 'fin_1',
      text: '我们对家庭财务有共同的理解和规划',
      weight: 1.5
    },
    {
      id: 'fin_2',
      text: '我们在重大财务决策上达成一致',
      weight: 2.2
    },
    {
      id: 'fin_3',
      text: '我们共同承担财务责任',
      weight: 1.3
    }
  ],
  intimacy: [
    {
      id: 'int_1',
      text: '我对我们的亲密关系感到满意',
      weight: 2.0
    },
    {
      id: 'int_2',
      text: '我们能够公开讨论彼此的亲密需求',
      weight: 1.5
    },
    {
      id: 'int_3',
      text: '我们的亲密关系增强了我们的情感联系',
      weight: 1.8
    }
  ],
  shared_values: [
    {
      id: 'val_1',
      text: '我们在核心价值观上有共识',
      weight: 2.0
    },
    {
      id: 'val_2',
      text: '我们对未来有共同的愿景',
      weight: 1.7
    },
    {
      id: 'val_3',
      text: '我们在重要的生活决策上有相似的观点',
      weight: 1.8
    }
  ],
  family_relations: [
    {
      id: 'fam_1',
      text: '我们与双方家庭保持良好的关系',
      weight: 1.2
    },
    {
      id: 'fam_2',
      text: '我的伴侣尊重我的家人',
      weight: 1.5
    },
    {
      id: 'fam_3',
      text: '我们在处理家庭关系上有共同的策略',
      weight: 1.3
    }
  ],
  parenting: [
    {
      id: 'par_1',
      text: '我们在育儿理念上有共识',
      weight: 2.3
    },
    {
      id: 'par_2',
      text: '我们共同分担育儿责任',
      weight: 2.0
    },
    {
      id: 'par_3',
      text: '我们在孩子面前表现出一致的态度',
      weight: 1.7
    }
  ],
  leisure_activities: [
    {
      id: 'leis_1',
      text: '我们享受一起度过的休闲时光',
      weight: 1.5
    },
    {
      id: 'leis_2',
      text: '我们定期安排共度的时光',
      weight: 1.3
    },
    {
      id: 'leis_3',
      text: '我们能够尊重彼此的个人空间和时间',
      weight: 1.2
    }
  ],
  personal_growth: [
    {
      id: 'grow_1',
      text: '我的伴侣支持我的个人目标和梦想',
      weight: 1.8
    },
    {
      id: 'grow_2',
      text: '我们的婚姻促进了我们各自的个人成长',
      weight: 1.5
    },
    {
      id: 'grow_3',
      text: '我们在婚姻中保持了个人的独立性',
      weight: 1.2
    }
  ]
};

// 导出问题数据
module.exports = marriageQuestions;