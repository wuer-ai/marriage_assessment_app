// 雷达图组件 - 备用实现（不依赖外部库）

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 图表数据
    chartData: {
      type: Array,
      value: [],
      observer: function(newVal) {
        // 添加防抖处理，避免短时间内多次初始化
        if (newVal && newVal.length > 0) {
          console.log('备用雷达图数据更新:', newVal);
          
          // 清除之前的定时器
          if (this._chartInitTimer) {
            clearTimeout(this._chartInitTimer);
          }
          
          // 设置新的定时器，延迟重绘
          this._chartInitTimer = setTimeout(() => {
            this.drawRadarChart();
          }, 300);
        } else {
          console.log('备用雷达图数据无效:', newVal);
        }
      }
    },
    // 图表宽度
    width: {
      type: Number,
      value: 300
    },
    // 图表高度
    height: {
      type: Number,
      value: 300
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    canvasId: 'radar-chart-canvas'
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      // 组件实例进入页面节点树时执行
      this._chartInitTimer = null;
      console.log('备用雷达图组件已附加');
    },
    ready: function() {
      // 组件在视图层布局完成后执行
      console.log('备用雷达图组件已就绪');
      
      // 延迟初始化，避免与数据更新冲突
      setTimeout(() => {
        if (this.properties.chartData && this.properties.chartData.length > 0) {
          console.log('备用雷达图组件就绪后初始化图表');
          this.drawRadarChart();
        }
      }, 500);
    },
    detached: function() {
      // 组件实例被从页面节点树移除时执行
      // 清除定时器
      if (this._chartInitTimer) {
        clearTimeout(this._chartInitTimer);
        this._chartInitTimer = null;
      }
      
      console.log('备用雷达图组件已分离');
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 绘制雷达图
    drawRadarChart: function() {
      const { chartData, width, height } = this.properties;
      const canvasId = this.data.canvasId;
      
      console.log('开始绘制雷达图:', chartData.length, '个数据点');
      
      if (!chartData || chartData.length === 0) {
        console.log('图表数据为空，不进行绘制');
        return;
      }
      
      try {
        // 获取画布上下文
        const ctx = wx.createCanvasContext(canvasId, this);
        
        if (!ctx) {
          console.log('无法获取画布上下文');
          return;
        }
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 设置图表中心点和半径
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;
        
        // 计算每个维度的角度
        const angleStep = (Math.PI * 2) / chartData.length;
        
        // 绘制雷达图背景网格
        this.drawRadarGrid(ctx, centerX, centerY, radius, chartData.length, angleStep);
        
        // 绘制雷达图数据区域
        this.drawRadarData(ctx, centerX, centerY, radius, chartData, angleStep);
        
        // 绘制维度标签
        this.drawRadarLabels(ctx, centerX, centerY, radius, chartData, angleStep);
        
        // 执行绘制
        ctx.draw(false, () => {
          console.log('备用雷达图绘制完成');
        });
      } catch (error) {
        console.log('备用雷达图绘制错误:', error);
      }
    },
    
    // 绘制雷达图背景网格
    drawRadarGrid: function(ctx, centerX, centerY, radius, count, angleStep) {
      // 绘制同心圆
      const gridCount = 5; // 网格层数
      
      for (let i = 1; i <= gridCount; i++) {
        const currentRadius = (radius / gridCount) * i;
        
        ctx.beginPath();
        ctx.setLineWidth(1);
        ctx.setStrokeStyle('#E8E8E8');
        
        // 绘制同心圆
        ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // 绘制从中心到各个顶点的线
        if (i === gridCount) {
          for (let j = 0; j < count; j++) {
            const angle = j * angleStep;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
              centerX + Math.cos(angle) * radius,
              centerY + Math.sin(angle) * radius
            );
            ctx.stroke();
          }
        }
      }
    },
    
    // 绘制雷达图数据区域
    drawRadarData: function(ctx, centerX, centerY, radius, chartData, angleStep) {
      // 找出最大分数，用于归一化
      const maxScore = 100; // 假设最大分数为100
      
      // 分离已回答和已跳过的类别
      const normalData = chartData.filter(item => !item.isSkipped);
      const skippedData = chartData.filter(item => item.isSkipped);
      
      console.log('绘制数据点:', normalData.length, '个已回答,', skippedData.length, '个已跳过');
      
      // 先绘制所有数据点，确保点始终可见
      this.drawAllDataPoints(ctx, centerX, centerY, radius, chartData, angleStep, maxScore);
      
      // 只有当有多个非跳过类别时，才绘制区域
      if (normalData.length > 1) {
        this.drawNormalArea(ctx, centerX, centerY, radius, normalData, chartData, angleStep, maxScore);
      }
    },
    
    // 绘制所有数据点
    drawAllDataPoints: function(ctx, centerX, centerY, radius, allData, angleStep, maxScore) {
      // 绘制已回答类别的数据点
      for (let i = 0; i < allData.length; i++) {
        const item = allData[i];
        const angle = i * angleStep;
        
        if (!item.isSkipped) {
          // 已回答类别的点
          const score = item.score / maxScore;
          const x = centerX + Math.cos(angle) * radius * score;
          const y = centerY + Math.sin(angle) * radius * score;
          
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.setFillStyle('#4A90E2');
          ctx.fill();
          ctx.setLineWidth(1);
          ctx.setStrokeStyle('#FFFFFF');
          ctx.stroke();
        } else {
          // 跳过类别的点
          const x = centerX + Math.cos(angle) * radius * 0.1; // 靠近中心点
          const y = centerY + Math.sin(angle) * radius * 0.1;
          
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.setFillStyle('#999999');
          ctx.fill();
          ctx.setLineWidth(1);
          ctx.setStrokeStyle('#CCCCCC');
          ctx.stroke();
        }
      }
    },
    
    // 绘制已回答类别的区域
    drawNormalArea: function(ctx, centerX, centerY, radius, normalData, allData, angleStep, maxScore) {
      // 创建已回答类别的索引映射
      const normalIndices = [];
      for (let i = 0; i < allData.length; i++) {
        if (!allData[i].isSkipped) {
          normalIndices.push(i);
        }
      }
      
      // 如果少于2个点，不绘制区域
      if (normalIndices.length < 2) {
        return;
      }
      
      // 绘制数据区域
      ctx.beginPath();
      
      // 移动到第一个点
      const firstIndex = normalIndices[0];
      const firstItem = allData[firstIndex];
      const firstAngle = firstIndex * angleStep;
      const firstScore = firstItem.score / maxScore;
      const firstX = centerX + Math.cos(firstAngle) * radius * firstScore;
      const firstY = centerY + Math.sin(firstAngle) * radius * firstScore;
      
      ctx.moveTo(firstX, firstY);
      
      // 连接其他已回答类别的点
      for (let i = 1; i < normalIndices.length; i++) {
        const index = normalIndices[i];
        const angle = index * angleStep;
        const score = allData[index].score / maxScore;
        const x = centerX + Math.cos(angle) * radius * score;
        const y = centerY + Math.sin(angle) * radius * score;
        
        ctx.lineTo(x, y);
      }
      
      // 闭合路径
      ctx.lineTo(firstX, firstY);
      
      // 填充区域
      ctx.setFillStyle('rgba(74, 144, 226, 0.3)');
      ctx.fill();
      
      // 绘制边框
      ctx.setLineWidth(2);
      ctx.setStrokeStyle('#4A90E2');
      ctx.stroke();
    },
    
    // 绘制维度标签
    drawRadarLabels: function(ctx, centerX, centerY, radius, chartData, angleStep) {
      const labelRadius = radius * 1.1; // 标签位置略微超出图表边缘
      
      ctx.setFontSize(12);
      ctx.setFillStyle('#666666');
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      
      for (let i = 0; i < chartData.length; i++) {
        const angle = i * angleStep;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;
        
        // 根据角度调整文本对齐方式，使标签更清晰
        if (angle === 0) {
          ctx.setTextAlign('left');
        } else if (Math.abs(angle - Math.PI) < 0.1) {
          ctx.setTextAlign('right');
        } else {
          ctx.setTextAlign('center');
        }
        
        if (angle > 0 && angle < Math.PI) {
          ctx.setTextBaseline('top');
        } else {
          ctx.setTextBaseline('bottom');
        }
        
        ctx.fillText(chartData[i].category, x, y);
      }
    }
  }
}) 