// 婚姻状态评分系统主脚本

// 全局变量
let currentCategoryIndex = 0;
let userAnswers = {};
let categoryScores = {};
let totalScore = 0;

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化事件监听
    initEventListeners();
});

// 初始化事件监听
function initEventListeners() {
    // 开始评估按钮
    document.getElementById('start-assessment').addEventListener('click', startAssessment);
    
    // 上一步按钮
    document.getElementById('prev-btn').addEventListener('click', goToPreviousCategory);
    
    // 下一步按钮
    document.getElementById('next-btn').addEventListener('click', goToNextCategory);
    
    // 跳过类别复选框
    document.getElementById('skip-category').addEventListener('change', toggleSkipCategory);
    
    // 打印结果按钮
    document.getElementById('print-results').addEventListener('click', printResults);
    
    // 下载报告按钮
    document.getElementById('download-results').addEventListener('click', downloadReport);
    
    // 重新评估按钮
    document.getElementById('restart-assessment').addEventListener('click', restartAssessment);
}

// 开始评估
function startAssessment() {
    // 隐藏欢迎页面，显示问卷页面
    document.getElementById('welcome-section').classList.remove('active');
    document.getElementById('questionnaire-section').classList.add('active');
    
    // 重置评估数据
    currentCategoryIndex = 0;
    userAnswers = {};
    categoryScores = {};
    
    // 加载第一个类别的问题
    loadCategory(currentCategoryIndex);
}

// 加载指定类别的问题
function loadCategory(index) {
    // 检查索引是否有效
    if (index < 0 || index >= marriageCategories.length) {
        return;
    }
    
    const category = marriageCategories[index];
    
    // 更新类别标题和描述
    document.getElementById('current-category-title').textContent = category.name;
    document.getElementById('current-category-description').textContent = category.description;
    
    // 重置跳过复选框
    document.getElementById('skip-category').checked = false;
    
    // 获取该类别的问题
    const questions = marriageQuestions[category.id];
    
    // 清空问题容器
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = '';
    
    // 动态生成问题
    questions.forEach((question, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        
        // 获取用户之前的回答（如果有）
        const savedAnswer = userAnswers[category.id] && userAnswers[category.id][question.id] 
            ? userAnswers[category.id][question.id] 
            : 3; // 默认值为3（中等）
        
        questionDiv.innerHTML = `
            <div class="question-text">${qIndex + 1}. ${question.text}</div>
            <div class="rating-container">
                <span>1</span>
                <div class="rating-slider">
                    <input type="range" min="1" max="5" step="1" value="${savedAnswer}" 
                           id="${question.id}" data-category="${category.id}" data-question="${question.id}">
                </div>
                <span>5</span>
            </div>
            <div class="rating-labels">
                <span>非常不同意</span>
                <span>不同意</span>
                <span>中立</span>
                <span>同意</span>
                <span>非常同意</span>
            </div>
        `;
        
        questionsContainer.appendChild(questionDiv);
        
        // 添加评分滑块的事件监听
        document.getElementById(question.id).addEventListener('change', function(e) {
            saveAnswer(category.id, question.id, parseInt(e.target.value));
        });
    });
    
    // 更新进度条
    updateProgressBar();
    
    // 更新导航按钮状态
    updateNavigationButtons();
}

// 保存用户回答
function saveAnswer(categoryId, questionId, value) {
    // 如果该类别不存在，创建一个空对象
    if (!userAnswers[categoryId]) {
        userAnswers[categoryId] = {};
    }
    
    // 保存回答
    userAnswers[categoryId][questionId] = value;
}

// 切换跳过类别
function toggleSkipCategory(e) {
    const questionsContainer = document.getElementById('questions-container');
    const category = marriageCategories[currentCategoryIndex];
    
    if (e.target.checked) {
        // 如果选中跳过，禁用所有问题
        questionsContainer.style.opacity = '0.5';
        questionsContainer.style.pointerEvents = 'none';
        
        // 删除该类别的所有回答
        delete userAnswers[category.id];
    } else {
        // 如果取消跳过，启用所有问题
        questionsContainer.style.opacity = '1';
        questionsContainer.style.pointerEvents = 'auto';
    }
}

// 前往上一个类别
function goToPreviousCategory() {
    if (currentCategoryIndex > 0) {
        currentCategoryIndex--;
        loadCategory(currentCategoryIndex);
    }
}

// 前往下一个类别
function goToNextCategory() {
    // 保存当前类别的所有回答
    const category = marriageCategories[currentCategoryIndex];
    const questions = marriageQuestions[category.id];
    
    // 如果没有跳过当前类别
    if (!document.getElementById('skip-category').checked) {
        questions.forEach(question => {
            const value = parseInt(document.getElementById(question.id).value);
            saveAnswer(category.id, question.id, value);
        });
    }
    
    // 如果是最后一个类别，计算结果并显示
    if (currentCategoryIndex === marriageCategories.length - 1) {
        calculateResults();
        showResults();
    } else {
        // 否则加载下一个类别
        currentCategoryIndex++;
        loadCategory(currentCategoryIndex);
    }
}

// 更新进度条
function updateProgressBar() {
    const progress = ((currentCategoryIndex + 1) / marriageCategories.length) * 100;
    document.getElementById('assessment-progress').style.width = `${progress}%`;
    document.getElementById('progress-percentage').textContent = `${Math.round(progress)}%`;
}

// 更新导航按钮状态
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // 如果是第一个类别，禁用上一步按钮
    prevBtn.disabled = currentCategoryIndex === 0;
    
    // 如果是最后一个类别，更改下一步按钮文本
    if (currentCategoryIndex === marriageCategories.length - 1) {
        nextBtn.textContent = '查看结果';
    } else {
        nextBtn.textContent = '下一步';
    }
}

// 计算评估结果
function calculateResults() {
    // 计算每个类别的分数
    marriageCategories.forEach(category => {
        const categoryId = category.id;
        
        // 如果用户跳过了该类别，不计算分数
        if (!userAnswers[categoryId]) {
            return;
        }
        
        const questions = marriageQuestions[categoryId];
        const questionScores = [];
        
        // 计算每个问题的分数
        questions.forEach(question => {
            if (userAnswers[categoryId][question.id]) {
                const rating = userAnswers[categoryId][question.id];
                const score = scoringSystem.calculateQuestionScore(rating);
                questionScores.push(score);
            }
        });
        
        // 计算类别平均分
        const categoryScore = scoringSystem.calculateCategoryScore(questionScores);
        
        // 保存类别分数
        categoryScores[categoryId] = {
            score: categoryScore,
            weight: category.weight
        };
    });
    
    // 计算总分
    totalScore = scoringSystem.calculateTotalScore(categoryScores);
}

// 显示评估结果
function showResults() {
    // 隐藏问卷页面，显示结果页面
    document.getElementById('questionnaire-section').classList.remove('active');
    document.getElementById('results-section').classList.add('active');
    
    // 显示总分
    document.getElementById('total-score').textContent = Math.round(totalScore);
    
    // 获取总分等级
    const totalGrade = scoringSystem.getTotalGrade(totalScore);
    
    // 显示总分等级和描述
    document.getElementById('total-grade').textContent = `${totalGrade.grade} - ${totalGrade.description}`;
    document.getElementById('total-description').textContent = totalGrade.generalComment;
    
    // 创建雷达图数据
    createRadarChart();
    
    // 创建仪表盘图
    createGaugeChart();
    
    // 显示类别详情
    displayCategoryDetails();
}

// 创建雷达图
function createRadarChart() {
    const ctx = document.getElementById('radar-chart').getContext('2d');
    
    // 准备数据
    const labels = [];
    const data = [];
    const backgroundColors = [];
    
    marriageCategories.forEach(category => {
        const categoryId = category.id;
        
        // 如果用户跳过了该类别，不包含在雷达图中
        if (!categoryScores[categoryId]) {
            return;
        }
        
        labels.push(category.name);
        
        // 将0-100的分数转换为1-5的评分
        const rating = categoryScores[categoryId].score / 20 + 1;
        data.push(rating);
        
        // 获取类别等级颜色
        const grade = scoringSystem.getCategoryGrade(categoryScores[categoryId].score);
        backgroundColors.push(grade.color);
    });
    
    // 创建雷达图
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '类别评分',
                data: data,
                backgroundColor: 'rgba(74, 111, 165, 0.2)',
                borderColor: 'rgba(74, 111, 165, 1)',
                pointBackgroundColor: backgroundColors,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(74, 111, 165, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 1,
                    suggestedMax: 5
                }
            }
        }
    });
}

// 创建仪表盘图
function createGaugeChart() {
    const ctx = document.getElementById('gauge-chart').getContext('2d');
    
    // 创建仪表盘图
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [totalScore, 100 - totalScore],
                backgroundColor: [
                    getScoreColor(totalScore),
                    '#e0e0e0'
                ],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            circumference: 180,
            rotation: 270,
            plugins: {
                tooltip: {
                    enabled: false
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// 根据分数获取颜色
function getScoreColor(score) {
    if (score >= 90) return '#4CAF50'; // A级 - 绿色
    if (score >= 75) return '#8BC34A'; // B级 - 浅绿色
    if (score >= 60) return '#FFC107'; // C级 - 黄色
    if (score >= 40) return '#FF9800'; // D级 - 橙色
    return '#F44336'; // E级 - 红色
}

// 显示类别详情
function displayCategoryDetails() {
    const categoryDetailsContainer = document.getElementById('category-details');
    categoryDetailsContainer.innerHTML = '';
    
    marriageCategories.forEach(category => {
        const categoryId = category.id;
        
        // 如果用户跳过了该类别，显示跳过信息
        if (!categoryScores[categoryId]) {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.innerHTML = `
                <div class="category-header">
                    <div class="category-title">
                        <i class="fas fa-forward"></i> ${category.name}
                    </div>
                    <div class="category-score">已跳过</div>
                </div>
            `;
            categoryDetailsContainer.appendChild(categoryCard);
            return;
        }
        
        // 获取类别分数和等级
        const score = categoryScores[categoryId].score;
        const grade = scoringSystem.getCategoryGrade(score);
        
        // 生成类别建议
        const suggestion = scoringSystem.generateCategorySuggestion(categoryId, score);
        
        // 创建类别卡片
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        
        categoryCard.innerHTML = `
            <div class="category-header" onclick="toggleCategoryContent(this)">
                <div class="category-title">
                    <i class="fas fa-chevron-down"></i> ${category.name}
                </div>
                <div class="category-score" style="color: ${grade.color}">
                    ${grade.grade} (${Math.round(score)}/100)
                </div>
            </div>
            <div class="category-content">
                <p>${category.description}</p>
                <div class="category-suggestion">
                    <strong>建议：</strong> ${suggestion}
                </div>
            </div>
        `;
        
        categoryDetailsContainer.appendChild(categoryCard);
    });
    
    // 添加类别内容切换函数
    window.toggleCategoryContent = function(header) {
        const content = header.nextElementSibling;
        content.classList.toggle('active');
        
        // 切换图标
        const icon = header.querySelector('i');
        if (content.classList.contains('active')) {
            icon.className = 'fas fa-chevron-up';
        } else {
            icon.className = 'fas fa-chevron-down';
        }
    };
}

// 打印结果
function printResults() {
    window.print();
}

// 下载报告
function downloadReport() {
    // 使用html2canvas和jsPDF生成PDF
    const { jsPDF } = window.jspdf;
    
    const resultsSection = document.getElementById('results-section');
    
    html2canvas(resultsSection, {
        scale: 1,
        useCORS: true,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('婚姻状态评估报告.pdf');
    });
}

// 重新评估
function restartAssessment() {
    // 隐藏结果页面，显示欢迎页面
    document.getElementById('results-section').classList.remove('active');
    document.getElementById('welcome-section').classList.add('active');
    
    // 重置数据
    currentCategoryIndex = 0;
    userAnswers = {};
    categoryScores = {};
    totalScore = 0;
}
