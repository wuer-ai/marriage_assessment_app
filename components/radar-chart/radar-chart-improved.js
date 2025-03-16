// 雷达图组件 - 改进版
import F2 from '@antv/wx-f2';

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
        console.log('雷达图数据更新:', newVal);
        if (newVal && newVal.length > 0) {
          this.initChart();
        } else {
          console.log('雷达图数据为空，不初始化图表');
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
    ctx: null,
    chart: null,
    isChartInitialized: false
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      // 组件实例进入页面节点树时执行
      console.log('雷达图组件已附加');
    },
    ready: function() {
      // 组件在视图层布局完成后执行
      console.log('雷达图组件已准备好');
      if (this.properties.chartData && this.properties.chartData.length > 0) {
        this.initChart();
      } else {
        console.log('雷达图组件准备好，但数据为空');
      }
    },
    detached: function() {
      // 组件实例被从页面节点树移除时执行
      console.log('雷达图组件已分离');
      if (this.data.chart) {
        this.data.chart.destroy();
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化图表
    initChart: function() {
      const self = this;
      const chartData = this.properties.chartData;
      
      console.log('初始化雷达图:', chartData);
      
      // 检查数据是否有效
      if (!chartData || chartData.length === 0) {
        console.log('雷达图数据无效，不初始化图表');
        return;
      }
      
      // 获取组件实例
      const componentInstance = this.selectComponent('#radar-chart');
      if (!componentInstance) {
        console.error('无法获取雷达图组件实例');
        return;
      }
      
      // 获取画布上下文
      componentInstance.init((canvas, width, height, F2) => {
        console.log('F2画布初始化:', width, height);
        
        // 检查画布是否有效
        if (!canvas) {
          console.error('无法获取画布上下文');
          return;
        }
        
        // 创建F2图表实例
        const chart = new F2.Chart({
          el: canvas,
          width: width,
          height: height,
          padding: [30, 30, 30, 30]
        });
        
        // 设置数据
        chart.source(chartData, {
          value: {
            min: 0,
            max: 100,
            tickCount: 5
          }
        });
        
        // 配置坐标系
        chart.coord('polar');
        
        // 配置轴
        chart.axis('name', {
          grid: {
            lineDash: null
          },
          label: {
            fontSize: 12
          }
        });
        
        chart.axis('value', {
          grid: {
            lineDash: null
          },
          label: null
        });
        
        // 添加雷达区域
        chart.area().position('name*value').color('#4A90E2').style({
          fillOpacity: 0.3
        });
        
        // 添加雷达线
        chart.line().position('name*value').color('#4A90E2');
        
        // 添加点
        chart.point().position('name*value').color('#4A90E2').size(4).style({
          stroke: '#fff',
          lineWidth: 1
        });
        
        // 添加标签
        chart.guide().text({
          position: ['50%', '0%'],
          content: '评分图',
          style: {
            fontSize: 14,
            fontWeight: 'bold',
            fill: '#666'
          }
        });
        
        // 渲染图表
        chart.render();
        
        // 保存图表实例
        self.setData({
          chart: chart,
          isChartInitialized: true
        });
        
        console.log('雷达图初始化完成');
        
        return chart;
      });
    },
    
    // 图表渲染错误
    onError: function(e) {
      console.log('F2图表渲染错误', e);
    },
    
    // 图表初始化完成
    onInitDone: function(e) {
      console.log('F2图表初始化完成', e);
    },
    
    // 图表渲染完成
    onRenderDone: function(e) {
      console.log('F2图表渲染完成', e);
    },
    
    // 触摸事件处理
    onTouchStart: function(e) {
      // 触摸开始事件
    },
    
    onTouchMove: function(e) {
      // 触摸移动事件
    },
    
    onTouchEnd: function(e) {
      // 触摸结束事件
    }
  }
}) 