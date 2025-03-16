# 雷达图组件使用指南

本项目提供了两种雷达图实现方案，以确保在不同环境下都能正常显示各维度评分图表。

## 方案一：使用 F2 图表库（推荐）

F2 是蚂蚁金服开源的一款专注于移动端的可视化解决方案，具有良好的性能和丰富的图表类型。

### 使用步骤

1. **安装依赖**
   ```bash
   npm install @antv/wx-f2 --save
   ```

2. **构建 npm 包**
   - 在微信开发者工具中，点击"工具" -> "构建 npm"
   - 等待构建完成

3. **检查构建结果**
   - 构建成功后，项目根目录下应该会出现 `miniprogram_npm` 目录
   - 该目录下应该包含 `@antv/wx-f2` 目录

4. **使用组件**
   ```html
   <radar-chart chart-data="{{radarChartData}}" width="{{radarChartWidth}}" height="{{radarChartHeight}}"></radar-chart>
   ```

## 方案二：使用备用雷达图实现

如果 F2 图表库无法正常工作，系统会自动切换到备用实现。备用实现使用微信小程序原生 Canvas API 绘制雷达图，不依赖外部库。

### 使用步骤

无需额外配置，系统会自动检测 F2 图表组件是否可用，如果不可用则自动切换到备用实现。

```html
<radar-chart-fallback chart-data="{{radarChartData}}" width="{{radarChartWidth}}" height="{{radarChartHeight}}"></radar-chart-fallback>
```

## 数据格式

雷达图组件接受以下格式的数据：

```javascript
[
  { category: "沟通", score: 85 },
  { category: "情感连接", score: 70 },
  { category: "冲突解决", score: 65 },
  // ...更多维度
]
```

其中：
- `category`：维度名称
- `score`：维度得分（0-100）

## 常见问题

1. **图表不显示**
   - 检查数据格式是否正确
   - 确保 `chart-data` 属性已正确传递
   - 检查控制台是否有错误信息

2. **F2 图表组件加载失败**
   - 确保已正确安装并构建 npm 包
   - 检查 `radar-chart.json` 中的组件引用路径
   - 尝试重新构建 npm 包

3. **图表样式不符合预期**
   - 调整 `width` 和 `height` 属性
   - 修改组件内部的样式设置

## 自定义样式

如果需要自定义雷达图样式，可以修改以下文件：

- F2 图表实现：`components/radar-chart/radar-chart.js`
- 备用实现：`components/radar-chart/radar-chart-fallback.js`

两种实现都支持修改颜色、大小、标签等样式。 