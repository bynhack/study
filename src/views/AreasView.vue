<template>
  <TeachingLayout :loading="loading">
    <!-- 控制面板插槽 -->
    <template #control-panel>
      <h2 class="panel-title">控制操作区</h2>
      
      <div class="concept-card">
        <h3 class="concept-card-title">图形选择</h3>
        <p>请选择要学习的平面图形：</p>
      </div>
      
      <div class="shape-selection">
        <button 
          v-for="shape in shapes" 
          :key="shape.id"
          :class="['shape-button', currentShape === shape.id ? 'active' : '']"
          @click="selectShape(shape.id)"
        >
          {{ shape.name }}
        </button>
      </div>
      
      <div class="input-group" v-if="currentShape === 'rectangle'">
        <label for="rectWidth">长度 (厘米)</label>
        <input 
          type="number" 
          id="rectWidth" 
          v-model.number="rectangle.length" 
          min="1" 
          max="20" 
          step="0.5"
          @change="updateShape"
        >
      </div>
      
      <div class="input-group" v-if="currentShape === 'rectangle'">
        <label for="rectHeight">宽度 (厘米)</label>
        <input 
          type="number" 
          id="rectHeight" 
          v-model.number="rectangle.width" 
          min="1" 
          max="20" 
          step="0.5"
          @change="updateShape"
        >
      </div>
      
      <div class="input-group" v-if="currentShape === 'square'">
        <label for="squareSide">边长 (厘米)</label>
        <input 
          type="number" 
          id="squareSide" 
          v-model.number="square.side" 
          min="1" 
          max="20" 
          step="0.5"
          @change="updateShape"
        >
      </div>
      
      <div class="input-group" v-if="currentShape === 'circle'">
        <label for="circleRadius">半径 (厘米)</label>
        <input 
          type="number" 
          id="circleRadius" 
          v-model.number="circle.radius" 
          min="1" 
          max="10" 
          step="0.5"
          @change="updateShape"
        >
      </div>
      
      <div class="input-group" v-if="currentShape === 'parallelogram'">
        <label for="paraBase">底边 (厘米)</label>
        <input 
          type="number" 
          id="paraBase" 
          v-model.number="parallelogram.base" 
          min="1" 
          max="20" 
          step="0.5"
          @change="updateShape"
        >
      </div>
      
      <div class="input-group" v-if="currentShape === 'parallelogram'">
        <label for="paraHeight">高 (厘米)</label>
        <input 
          type="number" 
          id="paraHeight" 
          v-model.number="parallelogram.height" 
          min="1" 
          max="20" 
          step="0.5"
          @change="updateShape"
        >
      </div>
      
      <div class="input-group" v-if="currentShape === 'trapezoid'">
        <label for="trapTopBase">上底 (厘米)</label>
        <input 
          type="number" 
          id="trapTopBase" 
          v-model.number="trapezoid.topBase" 
          min="1" 
          max="20" 
          step="0.5"
          @change="updateShape"
        >
      </div>
      
      <div class="input-group" v-if="currentShape === 'trapezoid'">
        <label for="trapBottomBase">下底 (厘米)</label>
        <input 
          type="number" 
          id="trapBottomBase" 
          v-model.number="trapezoid.bottomBase" 
          min="1" 
          max="20" 
          step="0.5"
          @change="updateShape"
        >
      </div>
      
      <div class="input-group" v-if="currentShape === 'trapezoid'">
        <label for="trapHeight">高 (厘米)</label>
        <input 
          type="number" 
          id="trapHeight" 
          v-model.number="trapezoid.height" 
          min="1" 
          max="20" 
          step="0.5"
          @change="updateShape"
        >
      </div>
      
      <button 
        class="action-button" 
        @click="resetShape"
      >重置图形</button>
      
      <div class="interaction-tip">
        <strong>互动提示：</strong>你可以拖动图形上的蓝色点来改变图形的尺寸和形状。
      </div>
      
      <hr>
      <router-link to="/" class="back-to-home">← 返回主页</router-link>
    </template>
    
    <!-- 内容区域插槽 -->
    <template #content-area>
      <TwoScene 
        ref="twoScene" 
        @sceneReady="onSceneReady"
        @animationFrame="onAnimationFrame"
      />
    </template>
    
    <!-- 知识概念区域插槽 -->
    <template #concept-panel>
      <h2 class="panel-title">平面图形面积计算</h2>
      
      <div class="concept-card">
        <h3 class="concept-card-title">当前图形</h3>
        <p v-if="currentShape">{{ getCurrentShapeName() }}</p>
        <p v-else>请在左侧选择一个图形</p>
      </div>
      
      <component :is="currentShapeComponent" />
      
    </template>
  </TeachingLayout>
</template>

<script>
import { markRaw, computed } from 'vue'
import TeachingLayout from '@/components/TeachingLayout.vue'
import TwoScene from '@/components/TwoScene.vue'
import MathFormula from '@/components/MathFormula.vue'
import RectangleArea from '@/components/areas/RectangleArea.vue'
import SquareArea from '@/components/areas/SquareArea.vue'
import CircleArea from '@/components/areas/CircleArea.vue'
import ParallelogramArea from '@/components/areas/ParallelogramArea.vue'
import TrapezoidArea from '@/components/areas/TrapezoidArea.vue'

export default {
  name: 'AreasView',
  components: {
    TeachingLayout,
    TwoScene,
    MathFormula,
    RectangleArea,
    SquareArea,
    CircleArea,
    ParallelogramArea,
    TrapezoidArea
  },
  data() {
    return {
      loading: true,
      two: null,
      shapes: [
        { id: 'rectangle', name: '长方形' },
        { id: 'square', name: '正方形' },
        { id: 'parallelogram', name: '平行四边形' },
        { id: 'trapezoid', name: '梯形' },
        { id: 'circle', name: '圆形' }
      ],
      currentShape: 'rectangle',
      
      // 长方形属性 - 修改属性名
      rectangle: {
        length: 10,
        width: 6
      },
      
      // 正方形属性
      square: {
        side: 8
      },
      
      // 圆形属性
      circle: {
        radius: 5
      },
      
      // 平行四边形属性
      parallelogram: {
        base: 10,
        height: 6,
        skew: 30
      },
      
      // 梯形属性
      trapezoid: {
        topBase: 6,
        bottomBase: 12,
        height: 6
      },
      
      // 当前图形对象
      currentShapeObject: null,
      draggablePoints: []
    }
  },
  computed: {
    currentShapeComponent() {
      switch(this.currentShape) {
        case 'rectangle':
          return 'RectangleArea'
        case 'square':
          return 'SquareArea'
        case 'circle':
          return 'CircleArea'
        case 'parallelogram':
          return 'ParallelogramArea'
        case 'trapezoid':
          return 'TrapezoidArea'
        default:
          return null
      }
    },
    currentShapeData() {
      switch(this.currentShape) {
        case 'rectangle':
          return this.rectangle
        case 'square':
          return this.square
        case 'circle':
          return this.circle
        case 'parallelogram':
          return this.parallelogram
        case 'trapezoid':
          return this.trapezoid
        default:
          return {}
      }
    }
  },
  provide() {
    // 创建一个响应式的计算属性
    const shapeDataComputed = computed(() => this.currentShapeData);
    
    return {
      shapeData: () => shapeDataComputed.value
    }
  },
  methods: {
    onSceneReady(sceneObjects) {
      this.two = markRaw(sceneObjects.two)
      this.container = sceneObjects.container
      
      // 设置中心点
      this.centerX = this.two.width / 2
      this.centerY = this.two.height / 2
      
      // 绘制初始图形
      this.selectShape(this.currentShape)
      
      this.loading = false
    },
    
    onAnimationFrame() {
      // 处理动画更新（如果需要）
    },
    
    selectShape(shapeId) {
      this.currentShape = shapeId
      this.updateShape()
    },
    
    getCurrentShapeName() {
      const shape = this.shapes.find(s => s.id === this.currentShape)
      return shape ? shape.name : ''
    },
    
    updateShape() {
      if (!this.two) return
      
      // 清除当前图形
      this.clearCurrentShape()
      
      // 根据选择的图形类型绘制
      switch(this.currentShape) {
        case 'rectangle':
          this.drawRectangle()
          break
        case 'square':
          this.drawSquare()
          break
        case 'circle':
          this.drawCircle()
          break
        case 'parallelogram':
          this.drawParallelogram()
          break
        case 'trapezoid':
          this.drawTrapezoid()
          break
      }
      
      this.two.update()
    },
    
    clearCurrentShape() {
      if (this.currentShapeObject) {
        if (Array.isArray(this.currentShapeObject)) {
          this.currentShapeObject.forEach(obj => this.two.remove(obj))
        } else {
          this.two.remove(this.currentShapeObject)
        }
      }
      
      // 清理所有拖拽点
      this.draggablePoints.forEach(dp => {
        if (dp && typeof dp.cleanup === 'function') {
          dp.cleanup()
        }
      })
      
      this.currentShapeObject = null
      this.draggablePoints = []
    },
    
    resetShape() {
      switch(this.currentShape) {
        case 'rectangle':
          this.rectangle = { length: 10, width: 6 }
          break
        case 'square':
          this.square = { side: 8 }
          break
        case 'circle':
          this.circle = { radius: 5 }
          break
        case 'parallelogram':
          this.parallelogram = { base: 10, height: 6, skew: 30 }
          break
        case 'trapezoid':
          this.trapezoid = { topBase: 6, bottomBase: 12, height: 6 }
          break
      }
      
      this.updateShape()
    },
    
    drawRectangle() {
      const { length, width } = this.rectangle
      const scale = 20 // 比例尺，20像素 = 1厘米
      
      const scaledLength = length * scale
      const scaledWidth = width * scale
      
      // 绘制矩形
      const x = this.centerX - scaledLength / 2
      const y = this.centerY - scaledWidth / 2
      
      this.currentShapeObject = markRaw(this.two.makeRectangle(
        this.centerX,
        this.centerY,
        scaledLength,
        scaledWidth
      ))
      
      this.currentShapeObject.fill = 'rgba(100, 149, 237, 0.3)'  // 淡蓝色
      this.currentShapeObject.stroke = '#2c3e50'
      this.currentShapeObject.linewidth = 2
      
      // 添加标注
      const labelL = markRaw(this.two.makeText(
        `${length} 厘米`,
        this.centerX,
        this.centerY + scaledWidth / 2 + 20
      ))
      
      const labelW = markRaw(this.two.makeText(
        `${width} 厘米`,
        this.centerX + scaledLength / 2 + 20,
        this.centerY
      ))
      
      labelW.rotation = Math.PI / 2
      
      this.currentShapeObject = [this.currentShapeObject, labelL, labelW]
      
      // 保存标签引用用于实时更新
      const updateLabels = (l, w) => {
        labelL.value = `${l} 厘米`
        labelW.value = `${w} 厘米`
        labelW.position.x = this.centerX + l * scale / 2 + 20
        labelL.position.y = this.centerY + w * scale / 2 + 20
        this.two.update()
      }
      
      // 添加可拖拽的点
      this.addDraggablePoint(x + scaledLength, y + scaledWidth, (pos) => {
        const newLength = Math.max(1, (pos.x - x) / scale)
        const newWidth = Math.max(1, (pos.y - y) / scale)
        
        const roundedLength = Math.round(newLength * 2) / 2
        const roundedWidth = Math.round(newWidth * 2) / 2
        
        // 更新数据，触发响应式更新
        this.rectangle = {
          ...this.rectangle,
          length: roundedLength,
          width: roundedWidth
        }
        
        // 调试日志
        console.log('Rectangle updated:', this.rectangle, 'CurrentShapeData:', this.currentShapeData);
        
        // 实时更新标签和形状
        if (pos.isDragging) {
          updateLabels(roundedLength, roundedWidth)
          // 实时更新矩形大小
          this.currentShapeObject[0].width = roundedLength * scale
          this.currentShapeObject[0].height = roundedWidth * scale
          this.two.update()
        } else {
          // 拖拽结束时才完全重绘
          this.updateShape()
        }
      })
    },
    
    drawSquare() {
      const { side } = this.square
      const scale = 20 // 比例尺，20像素 = 1厘米
      
      const scaledSide = side * scale
      
      // 绘制正方形
      const x = this.centerX - scaledSide / 2
      const y = this.centerY - scaledSide / 2
      
      this.currentShapeObject = markRaw(this.two.makeRectangle(
        this.centerX,
        this.centerY,
        scaledSide,
        scaledSide
      ))
      
      this.currentShapeObject.fill = 'rgba(46, 204, 113, 0.3)'  // 淡绿色
      this.currentShapeObject.stroke = '#2c3e50'
      this.currentShapeObject.linewidth = 2
      
      // 添加标注
      const label = markRaw(this.two.makeText(
        `${side} 厘米`,
        this.centerX,
        this.centerY + scaledSide / 2 + 20
      ))
      
      this.currentShapeObject = [this.currentShapeObject, label]
      
      // 保存标签引用用于实时更新
      const updateLabel = (s) => {
        label.value = `${s} 厘米`
        label.position.y = this.centerY + s * scale / 2 + 20
        this.two.update()
      }
      
      // 添加可拖拽的点
      this.addDraggablePoint(x + scaledSide, y + scaledSide, (pos) => {
        // 确保正方形保持等边
        const deltaX = pos.x - x
        const deltaY = pos.y - y
        const newSide = Math.max(deltaX, deltaY)
        
        const roundedSide = Math.round((newSide / scale) * 2) / 2
        
        // 更新数据，触发响应式更新
        this.square = {
          ...this.square,
          side: roundedSide
        }
        
        // 实时更新标签和形状
        if (pos.isDragging) {
          updateLabel(roundedSide)
          // 实时更新正方形大小
          this.currentShapeObject[0].width = roundedSide * scale
          this.currentShapeObject[0].height = roundedSide * scale
          this.two.update()
        } else {
          // 拖拽结束时才完全重绘
          this.updateShape()
        }
      })
    },
    
    drawCircle() {
      const { radius } = this.circle
      const scale = 20 // 比例尺，20像素 = 1厘米
      
      const scaledRadius = radius * scale
      
      // 绘制圆形
      this.currentShapeObject = markRaw(this.two.makeCircle(
        this.centerX,
        this.centerY,
        scaledRadius
      ))
      
      this.currentShapeObject.fill = 'rgba(231, 76, 60, 0.3)'  // 淡红色
      this.currentShapeObject.stroke = '#2c3e50'
      this.currentShapeObject.linewidth = 2
      
      // 添加半径线
      const radiusLine = markRaw(this.two.makeLine(
        this.centerX,
        this.centerY,
        this.centerX + scaledRadius,
        this.centerY
      ))
      
      radiusLine.stroke = '#2c3e50'
      radiusLine.linewidth = 1
      radiusLine.dashes = [5, 5]
      
      // 添加标注
      const label = markRaw(this.two.makeText(
        `半径: ${radius} 厘米`,
        this.centerX + scaledRadius / 2,
        this.centerY - 15
      ))
      
      this.currentShapeObject = [this.currentShapeObject, radiusLine, label]
      
      // 保存标签引用用于实时更新
      const updateCircle = (r) => {
        // 更新标签
        label.value = `半径: ${r} 厘米`
        label.position.x = this.centerX + r * scale / 2
        
        // 更新半径线
        radiusLine.vertices[1].x = this.centerX + r * scale
        
        // 更新圆形半径
        this.currentShapeObject[0].radius = r * scale
        
        this.two.update()
      }
      
      // 添加可拖拽的点
      this.addDraggablePoint(this.centerX + scaledRadius, this.centerY, (pos) => {
        const dx = pos.x - this.centerX
        const dy = pos.y - this.centerY
        const newRadius = Math.sqrt(dx * dx + dy * dy) / scale
        
        const roundedRadius = Math.round(newRadius * 2) / 2
        
        // 更新数据，触发响应式更新
        this.circle = {
          ...this.circle,
          radius: roundedRadius
        }
        
        // 实时更新标签和形状
        if (pos.isDragging) {
          updateCircle(roundedRadius)
        } else {
          // 拖拽结束时才完全重绘
          this.updateShape()
        }
      })
    },
    
    drawParallelogram() {
      const { base, height, skew } = this.parallelogram
      const scale = 20 // 比例尺，20像素 = 1厘米
      
      const scaledBase = base * scale
      const scaledHeight = height * scale
      const skewOffset = (height * Math.tan(skew * Math.PI / 180)) * scale
      
      // 计算四个顶点
      const left = this.centerX - scaledBase / 2
      const right = this.centerX + scaledBase / 2
      const top = this.centerY - scaledHeight / 2
      const bottom = this.centerY + scaledHeight / 2
      
      const points = [
        left + skewOffset, top,    // 左上
        right + skewOffset, top,   // 右上
        right, bottom,             // 右下
        left, bottom               // 左下
      ]
      
      // 绘制平行四边形
      this.currentShapeObject = markRaw(this.two.makePolygon(points[0], points[1], points[2], points[3], points[4], points[5], points[6], points[7]))
      
      this.currentShapeObject.fill = 'rgba(155, 89, 182, 0.3)'  // 淡紫色
      this.currentShapeObject.stroke = '#2c3e50'
      this.currentShapeObject.linewidth = 2
      
      // 添加高线
      const heightLine = markRaw(this.two.makeLine(
        left, top + (bottom - top) / 2,
        left + skewOffset, top + (bottom - top) / 2
      ))
      
      heightLine.stroke = '#2c3e50'
      heightLine.linewidth = 1
      heightLine.dashes = [5, 5]
      
      // 添加标注
      const labelBase = markRaw(this.two.makeText(
        `底边: ${base} 厘米`,
        this.centerX,
        bottom + 20
      ))
      
      const labelHeight = markRaw(this.two.makeText(
        `高: ${height} 厘米`,
        left + skewOffset / 2 - 15,
        this.centerY
      ))
      labelHeight.rotation = Math.PI / 2
      
      this.currentShapeObject = [this.currentShapeObject, heightLine, labelBase, labelHeight]
      
      // 添加可拖拽的点
      this.addDraggablePoint(right, bottom, (pos) => {
        const newBase = Math.max(1, (pos.x - left) / scale)
        
        const roundedBase = Math.round(newBase * 2) / 2
        
        // 更新数据，触发响应式更新
        this.parallelogram = {
          ...this.parallelogram,
          base: roundedBase
        }
        
        // 仅在拖拽结束时更新图形
        if (!pos.isDragging) {
          this.updateShape()
        }
      })
      
      this.addDraggablePoint(right + skewOffset, top, (pos) => {
        const newHeight = Math.max(1, (bottom - pos.y) / scale)
        
        const roundedHeight = Math.round(newHeight * 2) / 2
        
        // 更新数据，触发响应式更新
        this.parallelogram = {
          ...this.parallelogram,
          height: roundedHeight
        }
        
        // 仅在拖拽结束时更新图形
        if (!pos.isDragging) {
          this.updateShape()
        }
      })
    },
    
    drawTrapezoid() {
      const { topBase, bottomBase, height } = this.trapezoid
      const scale = 20 // 比例尺，20像素 = 1厘米
      
      const scaledTopBase = topBase * scale
      const scaledBottomBase = bottomBase * scale
      const scaledHeight = height * scale
      
      // 计算四个顶点
      const topLeft = this.centerX - scaledTopBase / 2
      const topRight = this.centerX + scaledTopBase / 2
      const bottomLeft = this.centerX - scaledBottomBase / 2
      const bottomRight = this.centerX + scaledBottomBase / 2
      
      const top = this.centerY - scaledHeight / 2
      const bottom = this.centerY + scaledHeight / 2
      
      const points = [
        topLeft, top,         // 左上
        topRight, top,        // 右上
        bottomRight, bottom,  // 右下
        bottomLeft, bottom    // 左下
      ]
      
      // 绘制梯形
      this.currentShapeObject = markRaw(this.two.makePolygon(points[0], points[1], points[2], points[3], points[4], points[5], points[6], points[7]))
      
      this.currentShapeObject.fill = 'rgba(241, 196, 15, 0.3)'  // 淡黄色
      this.currentShapeObject.stroke = '#2c3e50'
      this.currentShapeObject.linewidth = 2
      
      // 添加高线
      const heightLine = markRaw(this.two.makeLine(
        this.centerX, top,
        this.centerX, bottom
      ))
      
      heightLine.stroke = '#2c3e50'
      heightLine.linewidth = 1
      heightLine.dashes = [5, 5]
      
      // 添加标注
      const labelTopBase = markRaw(this.two.makeText(
        `上底: ${topBase} 厘米`,
        this.centerX,
        top - 15
      ))
      
      const labelBottomBase = markRaw(this.two.makeText(
        `下底: ${bottomBase} 厘米`,
        this.centerX,
        bottom + 20
      ))
      
      const labelHeight = markRaw(this.two.makeText(
        `高: ${height} 厘米`,
        this.centerX + 15,
        this.centerY
      ))
      labelHeight.rotation = Math.PI / 2
      
      this.currentShapeObject = [this.currentShapeObject, heightLine, labelTopBase, labelBottomBase, labelHeight]
      
      // 添加可拖拽的点
      this.addDraggablePoint(topRight, top, (pos) => {
        const newTopBase = Math.max(1, (pos.x - topLeft) / scale)
        
        const roundedTopBase = Math.round(newTopBase * 2) / 2
        
        // 更新数据，触发响应式更新
        this.trapezoid = {
          ...this.trapezoid,
          topBase: roundedTopBase
        }
        
        // 仅在拖拽结束时更新图形
        if (!pos.isDragging) {
          this.updateShape()
        }
      })
      
      this.addDraggablePoint(bottomRight, bottom, (pos) => {
        const newBottomBase = Math.max(1, (pos.x - bottomLeft) / scale)
        
        const roundedBottomBase = Math.round(newBottomBase * 2) / 2
        
        // 更新数据，触发响应式更新
        this.trapezoid = {
          ...this.trapezoid,
          bottomBase: roundedBottomBase
        }
        
        // 仅在拖拽结束时更新图形
        if (!pos.isDragging) {
          this.updateShape()
        }
      })
      
      this.addDraggablePoint(this.centerX, top, (pos) => {
        const newHeight = Math.max(1, (bottom - pos.y) / scale)
        
        const roundedHeight = Math.round(newHeight * 2) / 2
        
        // 更新数据，触发响应式更新
        this.trapezoid = {
          ...this.trapezoid,
          height: roundedHeight
        }
        
        // 仅在拖拽结束时更新图形
        if (!pos.isDragging) {
          this.updateShape()
        }
      })
    },
    
    addDraggablePoint(x, y, onDrag) {
      // 创建一个可交互的圆
      const point = markRaw(this.two.makeCircle(x, y, 8))
      point.fill = '#3498db'
      point.stroke = '#2c3e50'
      point.linewidth = 1
      
      // 先更新渲染，确保DOM元素已创建
      this.two.update()
      
      // 让点可交互
      let isDragging = false
      const svgElem = this.two.renderer.domElement
      
      // 确保DOM元素存在后再添加事件监听
      if (!point._renderer || !point._renderer.elem) {
        console.warn('拖拽点DOM元素未创建成功')
        
        // 尝试再次更新Two.js，有时候需要额外的渲染周期
        setTimeout(() => {
          this.two.update()
          
          if (point._renderer && point._renderer.elem) {
            setupInteractions()
          } else {
            console.error('无法创建拖拽点DOM元素')
          }
        }, 50)
      } else {
        setupInteractions()
      }
      
      const that = this
      
      function setupInteractions() {
        try {
          point._renderer.elem.style.cursor = 'pointer'
          point._renderer.elem.addEventListener('mousedown', startDrag)
          point._renderer.elem.addEventListener('touchstart', startTouchDrag, { passive: false })
        } catch (error) {
          console.error('设置拖拽交互失败:', error)
        }
      }
      
      function startDrag(e) {
        e.preventDefault()
        isDragging = true
        window.addEventListener('mousemove', drag)
        window.addEventListener('mouseup', endDrag)
      }
      
      function startTouchDrag(e) {
        e.preventDefault()
        if (e.touches.length === 1) {
          isDragging = true
          window.addEventListener('touchmove', touchDrag, { passive: false })
          window.addEventListener('touchend', endTouchDrag)
        }
      }
      
      function drag(e) {
        if (!isDragging) return
        
        const rect = svgElem.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        updatePosition(x, y)
      }
      
      function touchDrag(e) {
        if (!isDragging || e.touches.length !== 1) return
        e.preventDefault()
        
        const touch = e.touches[0]
        const rect = svgElem.getBoundingClientRect()
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top
        
        updatePosition(x, y)
      }
      
      function updatePosition(x, y) {
        point.translation.x = x
        point.translation.y = y
        that.two.update()
        
        // 调用回调函数，但不立即触发updateShape
        onDrag({ x, y, isDragging: true })
      }
      
      function endDrag() {
        isDragging = false
        window.removeEventListener('mousemove', drag)
        window.removeEventListener('mouseup', endDrag)
        
        // 拖拽结束时，调用回调函数并指示已结束拖拽
        const x = point.translation.x
        const y = point.translation.y
        onDrag({ x, y, isDragging: false })
      }
      
      function endTouchDrag() {
        isDragging = false
        window.removeEventListener('touchmove', touchDrag)
        window.removeEventListener('touchend', endTouchDrag)
        
        // 触摸拖拽结束时，调用回调函数并指示已结束拖拽
        const x = point.translation.x
        const y = point.translation.y
        onDrag({ x, y, isDragging: false })
      }
      
      // 保存点的引用，以便稍后清理
      this.draggablePoints.push({
        point,
        cleanup: () => {
          if (point._renderer && point._renderer.elem) {
            point._renderer.elem.removeEventListener('mousedown', startDrag)
            point._renderer.elem.removeEventListener('touchstart', startTouchDrag)
          }
          window.removeEventListener('mousemove', drag)
          window.removeEventListener('mouseup', endDrag)
          window.removeEventListener('touchmove', touchDrag)
          window.removeEventListener('touchend', endTouchDrag)
          this.two.remove(point)
        }
      })
    }
  }
}
</script>

<style scoped>
.shape-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.shape-button {
  flex: 1 0 calc(50% - 8px);
  padding: 8px;
  background-color: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.shape-button:hover {
  background-color: var(--bg-hover);
}

.shape-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: var(--bg-white);
}

.action-button {
  width: 100%;
  padding: 10px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: var(--primary-color-dark);
}

.interaction-tip {
  margin-top: 15px;
  padding: 10px;
  background-color: var(--bg-light);
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
}

.back-to-home {
  display: block;
  margin-top: 20px;
  text-decoration: none;
  color: var(--primary-color);
}

.back-to-home:hover {
  text-decoration: underline;
}
</style> 