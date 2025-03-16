// 雷达图组件 - 简单实现（最小化依赖）

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
        if (newVal && newVal.length > 0) {
          console.log('简单雷达图数据更新:', newVal);
          setTimeout(() => {
            this.drawSimpleRadarChart();
          }, 300);
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
    canvasId: 'simple-radar-canvas'
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    ready: function() {
      console.log('简单雷达图组件已就绪');
      setTimeout(() => {
        if (this.properties.chartData && this.properties.chartData.length > 0) {
          this.drawSimpleRadarChart();
        }
      }, 500);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 绘制简单雷达图
    drawSimpleRadarChart: function() {
      const { chartData, width, height } = this.properties;
      const canvasId = this.data.canvasId;
      
      console.log('开始绘制简单雷达图:', chartData.length, '个数据点');
      
      // 获取画布上下文
      const ctx = wx.createCanvasContext(canvasId, this);
      
      // 清空画布
      ctx.clearRect(0, 0, width, height);
      
      // 设置中心点和半径
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) * 0.5; // 进一步减小雷达图半径，为标签留出更多空间
      
      // 绘制背景圆
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.setStrokeStyle('#EEEEEE');
      ctx.setLineWidth(1);
      ctx.stroke();
      
      // 绘制内部圆
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * i / 5, 0, Math.PI * 2);
        ctx.setStrokeStyle('#EEEEEE');
        ctx.stroke();
      }
      
      // 分离已回答和已跳过的类别
      const normalData = chartData.filter(item => !item.isSkipped);
      const skippedData = chartData.filter(item => item.isSkipped);
      
      console.log('简单雷达图数据:', normalData.length, '个已回答,', skippedData.length, '个已跳过');
      
      // 计算角度步长
      const angleStep = (Math.PI * 2) / chartData.length;
      
      // 绘制轴线
      for (let i = 0; i < chartData.length; i++) {
        const angle = i * angleStep;
        const item = chartData[i];
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        );
        ctx.setStrokeStyle('#DDDDDD');
        ctx.stroke();
        
        // 绘制标签
        const labelDistance = radius + 40; // 进一步增加标签距离
        const labelX = centerX + Math.cos(angle) * labelDistance;
        const labelY = centerY + Math.sin(angle) * labelDistance;
        
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
        ctx.setFontSize(11);
        ctx.setFillStyle('#666666');
        ctx.fillText(item.category, labelX, labelY);
        
        // 绘制分数
        const scoreText = item.isSkipped ? '(已跳过)' : `(${Math.round(item.score)})`;
        const scoreY = labelY + (angle >= 0 && angle <= Math.PI ? 18 : -18); // 增加分数与类别名称的间距
        
        ctx.setFontSize(10);
        ctx.setFillStyle(item.isSkipped ? '#999999' : '#4A90E2');
        ctx.fillText(scoreText, labelX, scoreY);
      }
      
      // 只有当有多个非跳过类别时，才绘制区域
      if (normalData.length > 1) {
        // 绘制数据区域
        ctx.beginPath();
        
        let firstDrawn = false;
        
        for (let i = 0; i < chartData.length; i++) {
          const item = chartData[i];
          if (!item.isSkipped) {
            const angle = i * angleStep;
            const score = item.score / 100; // 归一化
            const x = centerX + Math.cos(angle) * radius * score;
            const y = centerY + Math.sin(angle) * radius * score;
            
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
      for (let i = 0; i < chartData.length; i++) {
        const item = chartData[i];
        const angle = i * angleStep;
        
        if (!item.isSkipped) {
          // 已回答类别的点
          const score = item.score / 100;
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
          const x = centerX + Math.cos(angle) * radius * 0.1;
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
      
      // 执行绘制
      ctx.draw(true, () => {
        console.log('简单雷达图绘制完成');
      });
    }
  }
}) 