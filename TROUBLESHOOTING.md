# 雷达图问题排查指南

如果您在使用雷达图组件时遇到问题，请按照以下步骤进行排查：

## 常见错误

### 1. "雷达图数据无效" 错误

**错误信息**：
```
radar-chart.js? [sm]:18 雷达图数据无效: []
```

**可能原因**：
- 组件在初始化时没有收到有效的数据
- 测试组件时没有提供测试数据
- 数据格式不正确

**解决方案**：
1. 确保在使用组件时提供有效的数据：
   ```html
   <radar-chart chart-data="{{radarChartData}}"></radar-chart>
   ```

2. 确保 `radarChartData` 是正确格式的数组：
   ```javascript
   radarChartData = [
     { category: "沟通", score: 85 },
     { category: "情感连接", score: 70 },
     // ...
   ]
   ```

3. 在测试组件时提供测试数据：
   ```html
   <radar-chart id="test-chart" chart-data="{{[{category:'测试',score:50}]}}"></radar-chart>
   ```

### 2. "找不到图表组件" 错误

**错误信息**：
```
找不到图表组件
```

**可能原因**：
- 组件内部的 `selectComponent` 调用失败
- 组件 ID 不匹配

**解决方案**：
1. 确保组件 ID 正确：
   ```html
   <f2-canvas id="radar-chart" canvas-id="radar-chart"></f2-canvas>
   ```

2. 在组件初始化时添加错误处理：
   ```javascript
   this.chartComponent = this.selectComponent('#radar-chart');
   if (!this.chartComponent) {
     console.log('找不到图表组件');
     return;
   }
   ```

### 3. F2 图表库加载失败

**错误信息**：
```
components/radar-chart/radar-chart.json: ["usingComponents"]["f2-canvas"]: "@antv/wx-f2", component not found
```

**可能原因**：
- npm 包未正确安装或构建
- 组件引用路径不正确

**解决方案**：
1. 确保正确安装 npm 包：
   ```bash
   npm install @antv/wx-f2 --save
   ```

2. 在微信开发者工具中构建 npm：
   - 点击"工具" -> "构建 npm"
   - 等待构建完成

3. 尝试不同的组件引用路径：
   ```json
   {
     "usingComponents": {
       "f2-canvas": "@antv/wx-f2"
     }
   }
   ```
   或
   ```json
   {
     "usingComponents": {
       "f2-canvas": "/miniprogram_npm/@antv/wx-f2/index"
     }
   }
   ```

## 调试技巧

1. **启用调试模式**：
   在 `app.json` 中添加 `"debug": true`

2. **查看控制台日志**：
   在微信开发者工具中打开"调试器"面板，查看"Console"标签页

3. **检查组件是否正确加载**：
   在页面加载时添加日志，检查组件是否正确初始化

4. **使用备用实现**：
   如果 F2 图表组件无法正常工作，可以使用备用的雷达图实现

## 最佳实践

1. **延迟初始化**：
   在组件的 `ready` 生命周期中初始化图表，而不是在 `attached` 中

2. **数据验证**：
   在设置图表数据前验证数据格式，确保数据有效

3. **错误处理**：
   添加适当的错误处理，避免因组件错误导致整个页面崩溃

4. **备用方案**：
   提供备用的图表实现，确保在任何情况下都能显示图表 