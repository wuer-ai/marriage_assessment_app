// 婚姻状态评分核心类别定义
const marriageCategories = [
  {
    id: 'communication',
    name: '沟通交流',
    description: '评估夫妻间的沟通质量、频率和效果',
    weight: 1.2,
    questions: []
  },
  {
    id: 'emotional_connection',
    name: '情感连接',
    description: '评估夫妻间的情感亲密度、共情能力和情感支持',
    weight: 1.3,
    questions: []
  },
  {
    id: 'conflict_resolution',
    name: '冲突解决',
    description: '评估夫妻处理分歧和冲突的方式和效果',
    weight: 1.2,
    questions: []
  },
  {
    id: 'financial_management',
    name: '财务管理',
    description: '评估夫妻对家庭财务的管理和共识',
    weight: 1.0,
    questions: []
  },
  {
    id: 'intimacy',
    name: '亲密关系',
    description: '评估夫妻间的身体亲密度和满意度',
    weight: 1.1,
    questions: []
  },
  {
    id: 'shared_values',
    name: '共同价值观',
    description: '评估夫妻在人生目标、价值观和信仰上的一致性',
    weight: 1.1,
    questions: []
  },
  {
    id: 'family_relations',
    name: '家庭关系',
    description: '评估与双方家庭的关系和互动',
    weight: 0.9,
    questions: []
  },
  {
    id: 'parenting',
    name: '育儿协作',
    description: '评估夫妻在育儿理念和实践上的协作',
    weight: 1.0,
    questions: []
  },
  {
    id: 'leisure_activities',
    name: '休闲活动',
    description: '评估夫妻共同参与休闲活动的频率和质量',
    weight: 0.8,
    questions: []
  },
  {
    id: 'personal_growth',
    name: '个人成长',
    description: '评估婚姻中双方的个人成长和支持',
    weight: 0.9,
    questions: []
  }
];

// 导出类别数据
module.exports = marriageCategories; 