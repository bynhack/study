<template>
  <TeachingLayout :loading="loading">
    <!-- 控制面板插槽 -->
    <template #control-panel>
      <h2 class="panel-title">通用长方体切割</h2>
      
      <div class="concept-card">
        <h3 class="concept-card-title">提示</h3>
        <p>设置长方体尺寸和切割点，点击【应用切割】按钮观察长方体被切割成小长方体的过程。</p>
      </div>
      
      <div class="input-section">
        <h3>长方体尺寸</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="cuboidLength">长度 (X)</label>
            <input type="number" id="cuboidLength" v-model.number="cuboidDims.length" min="1" step="0.1">
          </div>
          <div class="input-group">
            <label for="cuboidWidth">宽度 (Y)</label>
            <input type="number" id="cuboidWidth" v-model.number="cuboidDims.width" min="1" step="0.1">
          </div>
          <div class="input-group">
            <label for="cuboidHeight">高度 (Z)</label>
            <input type="number" id="cuboidHeight" v-model.number="cuboidDims.height" min="1" step="0.1">
          </div>
        </div>
      </div>
      
      <div class="input-section">
        <h3>切割参数</h3>
        <div class="input-group">
          <label for="cutX">沿长度方向切割点 (逗号分隔)</label>
          <input type="text" id="cutX" v-model="cutPositions.x" placeholder="例如: 2">
          <small>值必须在 0 和 长度 之间</small>
        </div>
        <div class="input-group">
          <label for="cutY">沿宽度方向切割点 (逗号分隔)</label>
          <input type="text" id="cutY" v-model="cutPositions.y" placeholder="例如: 1.5">
          <small>值必须在 0 和 宽度 之间</small>
        </div>
        <div class="input-group">
          <label for="cutZ">沿高度方向切割点 (逗号分隔)</label>
          <input type="text" id="cutZ" v-model="cutPositions.z" placeholder="例如: 1">
          <small>值必须在 0 和 高度 之间</small>
        </div>
      </div>
      
      <div class="input-group">
        <label for="cutGap">切割间隙</label>
        <input 
          type="number" 
          id="cutGap" 
          v-model.number="cutGap" 
          min="0.05" 
          max="1" 
          step="0.05"
        >
      </div>
      
      <div class="input-group">
        <label for="animationSpeed">动画速度</label>
        <select id="animationSpeed" v-model="animationSpeed">
          <option value="0.5">慢速</option>
          <option value="1">正常</option>
          <option value="2">快速</option>
        </select>
      </div>
      
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      
      <button 
        class="action-button" 
        @click="startCutAnimation"
        :disabled="isAnimating"
      >应用切割 & 演示</button>
      
      <button 
        class="action-button secondary-button" 
        @click="resetView"
        :disabled="isAnimating"
      >重置视角</button>
      
      <hr>
      <router-link to="/" class="back-to-home">← 返回主页</router-link>
    </template>
    
    <!-- 内容区域插槽 -->
    <template #content-area>
      <ThreeScene 
        ref="threeScene" 
        @sceneReady="onSceneReady"
        @animationFrame="onAnimationFrame"
      />
    </template>
    
    <!-- 知识概念区域插槽 -->
    <template #concept-panel>
      <h2 class="panel-title">长方体切割与表面积</h2>

      <div class="concept-card">
        <h3 class="concept-card-title">核心概念</h3>
        <p>将一个长方体切割成多个小长方体时，会产生新的表面，从而增加总表面积。</p>
      </div>
      
      <h3 class="panel-subtitle">初始状态</h3>
      <p>原始长方体尺寸为长 <strong>{{ cuboidDims.length }}</strong>、宽 <strong>{{ cuboidDims.width }}</strong>、高 <strong>{{ cuboidDims.height }}</strong>。</p>
      <p>它有6个面，表面积为 <strong>{{ initialTotalArea.toFixed(2) }}</strong> 平方单位。</p>
      
      <h3 class="panel-subtitle">切割过程</h3>
      <p>按照参数沿三个方向进行切割：</p>
      <ul>
        <li>沿X方向切 <strong>{{ parsedCutPositions.x.length }}</strong> 刀</li>
        <li>沿Y方向切 <strong>{{ parsedCutPositions.y.length }}</strong> 刀</li>
        <li>沿Z方向切 <strong>{{ parsedCutPositions.z.length }}</strong> 刀</li>
      </ul>
      <p>总共切割 <strong>{{ totalCuts }}</strong> 刀，形成 <strong>{{ totalPieces }}</strong> 个小长方体。</p>
      
      <h3 class="panel-subtitle">表面积变化</h3>
      <p>每切一刀会形成 <strong>2个</strong> 新的内部表面。</p>
      <p>所有切割面总面积: <strong>{{ totalCutArea.toFixed(2) }}</strong> 平方单位</p>
      <p>切割后的总表面积: <strong>{{ finalTotalArea.toFixed(2) }}</strong> 平方单位</p>
      <p>表面积增长百分比: <strong>{{ surfaceAreaIncrease.toFixed(2) }}%</strong></p>
      
      <hr>
      
      <h3 class="panel-subtitle">颜色说明</h3>
      <p class="color-key"><span class="original-color-bg"></span> 代表 <strong>原始</strong> 的外表面</p>
      <p class="color-key"><span class="new-color-bg"></span> 代表切割后 <strong>新增</strong> 的内表面</p>
    </template>
  </TeachingLayout>
</template>

<script>
import * as THREE from 'three'
import TeachingLayout from '@/components/TeachingLayout.vue'
import ThreeScene from '@/components/ThreeScene.vue'

export default {
  name: 'CuboidCutView',
  components: {
    TeachingLayout,
    ThreeScene
  },
  data() {
    return {
      loading: true,
      errorMessage: '',
      
      // 长方体尺寸
      cuboidDims: {
        length: 4,
        width: 3,
        height: 2
      },
      
      // 切割参数 - 存储为字符串以便用户输入
      cutPositions: {
        x: "2",
        y: "1.5",
        z: "1"
      },
      cutGap: 0.2,
      animationSpeed: 1,
      
      // 场景对象
      scene: null,
      camera: null,
      controls: null,
      
      // 动画相关
      isAnimating: false,
      animationProgress: 0,
      animationDuration: 1.5,
      clock: new THREE.Clock(),
      
      // 物体
      originalCuboid: null,
      smallCuboids: [],
      animationGroup: new THREE.Group(),
      selectedPiece: null,
      
      // 材质
      originalMaterial: null,
      cutMaterial: null,
      
      // 位置数据
      initialPositions: [],
      targetPositions: [],
      
      // 常量
      originalOpacity: 1.0,
      weakenedOpacity: 0.15
    }
  },
  computed: {
    // 解析后的切割位置
    parsedCutPositions() {
      return {
        x: this.parseCutPositions(this.cutPositions.x, this.cuboidDims.length),
        y: this.parseCutPositions(this.cutPositions.y, this.cuboidDims.width),
        z: this.parseCutPositions(this.cutPositions.z, this.cuboidDims.height)
      }
    },
    
    // 计算总切割数
    totalCuts() {
      return this.parsedCutPositions.x.length + 
             this.parsedCutPositions.y.length + 
             this.parsedCutPositions.z.length
    },
    
    // 计算总块数
    totalPieces() {
      return (this.parsedCutPositions.x.length + 1) * 
             (this.parsedCutPositions.y.length + 1) * 
             (this.parsedCutPositions.z.length + 1)
    },
    
    // 计算原始表面积
    initialTotalArea() {
      const { length, width, height } = this.cuboidDims
      return 2 * (length * width + length * height + width * height)
    },
    
    // 计算X方向切割面总面积
    xCutArea() {
      const { width, height } = this.cuboidDims
      return this.parsedCutPositions.x.length * width * height * 2 // 每刀产生2个面
    },
    
    // 计算Y方向切割面总面积
    yCutArea() {
      const { length, height } = this.cuboidDims
      return this.parsedCutPositions.y.length * length * height * 2
    },
    
    // 计算Z方向切割面总面积
    zCutArea() {
      const { length, width } = this.cuboidDims
      return this.parsedCutPositions.z.length * length * width * 2
    },
    
    // 计算总切割面积
    totalCutArea() {
      return this.xCutArea + this.yCutArea + this.zCutArea
    },
    
    // 计算最终总表面积
    finalTotalArea() {
      return this.initialTotalArea + this.totalCutArea
    },
    
    // 计算表面积增长百分比
    surfaceAreaIncrease() {
      return (this.totalCutArea / this.initialTotalArea) * 100
    }
  },
  methods: {
    onSceneReady(sceneObjects) {
      // 保存场景对象
      this.scene = sceneObjects.scene
      this.camera = sceneObjects.camera
      this.controls = sceneObjects.controls
      
      // 设置材质
      this.originalMaterial = new THREE.MeshStandardMaterial({
        color: 0x6495ED, // 蓝色
        roughness: 0.6,
        metalness: 0.1,
        transparent: true
      })
      
      this.cutMaterial = new THREE.MeshStandardMaterial({
        color: 0xFA8072, // 红色
        roughness: 0.6,
        metalness: 0.1,
        transparent: true
      })
      
      this.wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0x000000, 
        linewidth: 1
      })
      
      // 添加动画组到场景
      this.scene.add(this.animationGroup)
      
      // 创建初始长方体
      this.createOriginalCuboid()
      
      // 设置相机位置
      this.resetView()
      
      // 添加点击事件
      this.$refs.threeScene.$el.addEventListener('click', this.onPointerClick)
      
      this.loading = false
    },
    
    onAnimationFrame() {
      if (!this.isAnimating) return
      
      // 更新动画进度
      const deltaTime = this.clock.getDelta() * this.animationSpeed
      this.animationProgress += deltaTime / this.animationDuration
      
      if (this.animationProgress >= 1) {
        this.animationProgress = 1
        this.isAnimating = false
      }
      
      // 使用缓动函数使动画更自然
      const easedProgress = this.easeInOutCubic(this.animationProgress)
      
      // 更新所有小长方体的位置
      for (let i = 0; i < this.smallCuboids.length; i++) {
        if (this.smallCuboids[i] && this.initialPositions[i] && this.targetPositions[i]) {
          this.smallCuboids[i].position.lerpVectors(
            this.initialPositions[i],
            this.targetPositions[i],
            easedProgress
          )
        }
      }
    },
    
    createOriginalCuboid() {
      // 清空场景
      if (this.originalCuboid) {
        this.animationGroup.remove(this.originalCuboid)
        this.originalCuboid.geometry.dispose()
      }
      
      this.smallCuboids.forEach(cuboid => {
        this.animationGroup.remove(cuboid)
        cuboid.geometry.dispose()
      })
      
      this.smallCuboids = []
      
      // 创建长方体几何体
      const { length, width, height } = this.cuboidDims
      const geometry = new THREE.BoxGeometry(length, width, height)
      
      // 创建网格
      this.originalCuboid = new THREE.Mesh(geometry, this.originalMaterial)
      this.animationGroup.add(this.originalCuboid)
    },
    
    createSmallCuboids() {
      // 清理现有小立方体
      this.smallCuboids.forEach(cuboid => {
        this.animationGroup.remove(cuboid)
        if (cuboid.geometry) cuboid.geometry.dispose()
        if (Array.isArray(cuboid.material)) {
          cuboid.material.forEach(mat => {
            if (mat) mat.dispose()
          })
        }
      })
      
      this.smallCuboids = []
      this.initialPositions = []
      this.targetPositions = []
      
      const { length, width, height } = this.cuboidDims
      
      // 获取切割位置，包括起始点和终点
      const xBounds = [0, ...this.parsedCutPositions.x, length]
      const yBounds = [0, ...this.parsedCutPositions.y, width]
      const zBounds = [0, ...this.parsedCutPositions.z, height]
      
      // 计算用于分离的间隙
      const avgSize = (length / xBounds.length + width / yBounds.length + height / zBounds.length) / 3
      const gap = this.cutGap * avgSize
      
      let pieceIndex = 0
      
      // 为每个区域创建小长方体
      for (let i = 0; i < xBounds.length - 1; i++) {
        for (let j = 0; j < yBounds.length - 1; j++) {
          for (let k = 0; k < zBounds.length - 1; k++) {
            // 计算小长方体的尺寸
            const pieceLength = xBounds[i+1] - xBounds[i]
            const pieceWidth = yBounds[j+1] - yBounds[j]
            const pieceHeight = zBounds[k+1] - zBounds[k]
            
            // 计算小长方体的中心位置（相对于整个长方体的中心）
            const centerX = xBounds[i] + pieceLength/2 - length/2
            const centerY = yBounds[j] + pieceWidth/2 - width/2
            const centerZ = zBounds[k] + pieceHeight/2 - height/2
            
            // 判断哪些面是原始外表面
            const isOriginalRight = Math.abs(xBounds[i+1] - length) < 0.001
            const isOriginalLeft = Math.abs(xBounds[i]) < 0.001
            const isOriginalTop = Math.abs(yBounds[j+1] - width) < 0.001
            const isOriginalBottom = Math.abs(yBounds[j]) < 0.001
            const isOriginalFront = Math.abs(zBounds[k+1] - height) < 0.001
            const isOriginalBack = Math.abs(zBounds[k]) < 0.001
            
            // 为每个面创建材质
            const materials = [
              (isOriginalRight ? this.originalMaterial : this.cutMaterial).clone(),
              (isOriginalLeft ? this.originalMaterial : this.cutMaterial).clone(),
              (isOriginalTop ? this.originalMaterial : this.cutMaterial).clone(),
              (isOriginalBottom ? this.originalMaterial : this.cutMaterial).clone(),
              (isOriginalFront ? this.originalMaterial : this.cutMaterial).clone(),
              (isOriginalBack ? this.originalMaterial : this.cutMaterial).clone()
            ]
            
            // 设置材质为透明，以便实现高亮/淡化效果
            materials.forEach(mat => {
              mat.transparent = true
              mat.opacity = this.originalOpacity
            })
            
            // 创建几何体和网格
            const geometry = new THREE.BoxGeometry(pieceLength, pieceWidth, pieceHeight)
            const cuboid = new THREE.Mesh(geometry, materials)
            
            // 保存初始位置
            this.initialPositions[pieceIndex] = new THREE.Vector3(centerX, centerY, centerZ)
            cuboid.position.copy(this.initialPositions[pieceIndex])
            
            // 计算目标位置（分离后）
            const gapX = (i - (xBounds.length - 2) / 2) * gap
            const gapY = (j - (yBounds.length - 2) / 2) * gap
            const gapZ = (k - (zBounds.length - 2) / 2) * gap
            
            this.targetPositions[pieceIndex] = new THREE.Vector3(
              centerX + gapX,
              centerY + gapY,
              centerZ + gapZ
            )
            
            // 添加到场景
            this.animationGroup.add(cuboid)
            this.smallCuboids.push(cuboid)
            pieceIndex++
          }
        }
      }
    },
    
    startCutAnimation() {
      // 验证参数
      if (!this.validateInputs()) return
      
      // 重置动画状态
      this.animationProgress = 0
      this.isAnimating = true
      this.clock.start()
      
      // 重置场景
      this.createOriginalCuboid()
      
      // 创建小长方体
      this.createSmallCuboids()
      
      // 移除原始长方体
      if (this.originalCuboid) {
        this.animationGroup.remove(this.originalCuboid)
      }
    },
    
    validateInputs() {
      this.errorMessage = ''
      
      // 验证长方体尺寸
      const { length, width, height } = this.cuboidDims
      if (length <= 0 || width <= 0 || height <= 0) {
        this.errorMessage = '长方体尺寸必须为正数。'
        return false
      }
      
      // 验证切割点
      const { x, y, z } = this.parsedCutPositions
      
      if (x.some(pos => pos <= 0 || pos >= length)) {
        this.errorMessage = `沿X方向的切割点必须在0和${length}之间。`
        return false
      }
      
      if (y.some(pos => pos <= 0 || pos >= width)) {
        this.errorMessage = `沿Y方向的切割点必须在0和${width}之间。`
        return false
      }
      
      if (z.some(pos => pos <= 0 || pos >= height)) {
        this.errorMessage = `沿Z方向的切割点必须在0和${height}之间。`
        return false
      }
      
      if (this.cutGap <= 0) {
        this.errorMessage = '切割间隙必须为正数。'
        return false
      }
      
      return true
    },
    
    resetView() {
      if (!this.camera || !this.controls) return
      
      // 计算合适的相机位置
      const maxDim = Math.max(
        this.cuboidDims.length,
        this.cuboidDims.width,
        this.cuboidDims.height
      )
      
      const distance = maxDim * 2.5
      
      // 设置相机位置
      this.camera.position.set(distance * 0.6, distance * 0.5, distance * 0.8)
      this.camera.lookAt(0, 0, 0)
      
      // 更新控制器
      this.controls.target.set(0, 0, 0)
      this.controls.update()
      
      // 重置动画状态
      this.isAnimating = false
      
      // 取消选中状态
      this.unhighlightAllPieces()
      
      // 如果已经创建了小长方体，则重置它们的位置
      if (this.smallCuboids.length > 0 && this.initialPositions.length > 0) {
        for (let i = 0; i < this.smallCuboids.length; i++) {
          if (this.smallCuboids[i] && this.initialPositions[i]) {
            this.smallCuboids[i].position.copy(this.initialPositions[i])
          }
        }
      } else {
        // 如果没有小长方体，则创建原始长方体
        this.createOriginalCuboid()
      }
    },
    
    // 缓动函数
    easeInOutCubic(t) {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    },
    
    // 解析切割位置
    parseCutPositions(positionsStr, maxDimension) {
      if (!positionsStr.trim()) return []
      
      // 解析输入字符串中的数字
      const positions = positionsStr.split(',')
        .map(s => parseFloat(s.trim()))
        .filter(n => !isNaN(n) && n > 0 && n < maxDimension)
      
      // 移除重复值并排序
      return [...new Set(positions)].sort((a, b) => a - b)
    },
    
    // 处理点击事件
    onPointerClick(event) {
      if (this.isAnimating) return
      
      // 创建射线检测器
      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2()
      
      // 获取鼠标位置
      const rect = this.$refs.threeScene.$el.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      // 设置射线
      raycaster.setFromCamera(pointer, this.camera)
      
      // 检测射线与小长方体相交
      const intersects = raycaster.intersectObjects(this.smallCuboids)
      
      if (intersects.length > 0) {
        // 点击到了小长方体
        const clickedPiece = intersects[0].object
        
        if (this.selectedPiece === clickedPiece) {
          // 再次点击相同小长方体，取消选中
          this.unhighlightAllPieces()
        } else {
          // 选中不同小长方体
          this.unhighlightAllPieces()
          this.selectedPiece = clickedPiece
          this.highlightPiece(this.selectedPiece)
        }
      } else {
        // 点击背景，取消选中
        this.unhighlightAllPieces()
      }
    },
    
    // 高亮显示选中的小长方体
    highlightPiece(piece) {
      this.smallCuboids.forEach(cuboid => {
        cuboid.material.forEach(mat => {
          mat.opacity = (cuboid === piece) ? this.originalOpacity : this.weakenedOpacity
        })
      })
    },
    
    // 取消所有高亮
    unhighlightAllPieces() {
      if (!this.smallCuboids.length) return
      
      this.smallCuboids.forEach(cuboid => {
        cuboid.material.forEach(mat => {
          mat.opacity = this.originalOpacity
        })
      })
      this.selectedPiece = null
    }
  },
  watch: {
    // 监听长方体尺寸变化
    'cuboidDims.length'() {
      if (!this.isAnimating) this.createOriginalCuboid()
    },
    'cuboidDims.width'() {
      if (!this.isAnimating) this.createOriginalCuboid()
    },
    'cuboidDims.height'() {
      if (!this.isAnimating) this.createOriginalCuboid()
    }
  }
}
</script>

<style scoped>
.input-section {
  border: 1px solid var(--border-color);
  border-radius: 5px;
  padding: 10px 15px;
  margin-bottom: 15px;
  background-color: var(--bg-light);
}

.input-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1em;
  color: var(--primary-color);
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.input-section .input-group {
  margin-bottom: 15px;
}

/* 最后一个元素不需要底部边距 */
.input-section .input-group:last-child {
  margin-bottom: 5px;
}

.input-group {
  margin-bottom: 10px;
}

.input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 0.9em;
  color: var(--secondary-color);
}

.input-group input[type="number"],
.input-group input[type="text"],
.input-group select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.95em;
  background-color: #e9ecef;
}

.input-group input:focus,
.input-group input[type="text"]:focus,
.input-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--bg-white);
  box-shadow: 0 0 0 3px rgba(74, 108, 212, 0.25);
}

.input-group small {
  display: block;
  font-size: 0.8em;
  color: var(--secondary-color);
  margin-top: 4px;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
  font-size: 0.9em;
}

.secondary-button {
  background-color: var(--secondary-color);
  margin-top: 10px;
}

.secondary-button:hover {
  background-color: #5a6268;
}

.back-to-home {
  display: block;
  color: var(--primary-color);
  text-decoration: none;
  margin-top: 20px;
  font-weight: 600;
  font-size: 0.9em;
}

.back-to-home:hover {
  text-decoration: underline;
}

/* 文本输入框样式调整 */
.input-group input[type="text"] {
  width: 100%;
  font-family: inherit;
  box-sizing: border-box;
}
</style> 