// 雷达图组件
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
          console.error('雷达图数据无效:', newVal);
        }
      }
    },
    // 图表宽度
    width: {
      type: Number,
      value: 400
    },
    // 图表高度
    height: {
      type: Number,
      value: 400
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    opts: {
      lazyLoad: true
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化图表
    initChart: function() {
      const self = this;
      const { chartData, width, height } = this.properties;
      
      console.log('初始化雷达图:', chartData, width, height);
      
      if (!chartData || chartData.length === 0) {
        console.error('图表数据为空');
        return;
      }
      
      this.chartComponent = this.selectComponent('#radar-chart');
      
      if (!this.chartComponent) {
        console.error('找不到图表组件');
        return;
      }
      
      try {
        this.chartComponent.init((canvas, width, height, F2) => {
          console.log('图表画布初始化:', canvas, width, height);
          
          if (!canvas) {
            console.error('画布对象为空');
            return null;
          }
          
          // 创建图表实例
          const chart = new F2.Chart({
            el: canvas,
            width,
            height,
            padding: [50, 50, 50, 50]
          });
          
          // 设置数据
          chart.source(chartData);
          
          // 设置坐标系
          chart.coord('polar');
          
          // 设置刻度线
          chart.axis('score', {
            grid: {
              lineDash: [0],
              strokeStyle: '#E8E8E8'
            },
            label: null
          });
          
          // 设置分类轴
          chart.axis('category', {
            grid: {
              lineDash: [0],
              strokeStyle: '#E8E8E8'
            },
            label: {
              fontSize: 12,
              fill: '#666'
            }
          });
          
          // 绘制区域
          chart.area()
            .position('category*score')
            .color('#4A90E2')
            .style({
              fillOpacity: 0.3
            });
          
          // 绘制线
          chart.line()
            .position('category*score')
            .color('#4A90E2')
            .size(2);
          
          // 绘制点
          chart.point()
            .position('category*score')
            .color('#4A90E2')
            .size(4)
            .style({
              stroke: '#fff',
              lineWidth: 1
            });
          
          // 渲染图表
          chart.render();
          
          console.log('雷达图渲染完成');
          
          // 返回图表实例
          return chart;
        });
      } catch (error) {
        console.error('雷达图初始化错误:', error);
      }
    },
    
    // 图表渲染错误
    onError: function(e) {
      console.error('图表渲染错误', e);
    }
  }
}) 