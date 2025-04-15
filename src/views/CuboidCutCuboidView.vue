<template>
  <TeachingLayout :loading="loading">
    <!-- 控制面板插槽 -->
    <template #control-panel>
      <h2 class="panel-title">控制操作区</h2>
      
      <div class="concept-card">
        <h3 class="concept-card-title">提示</h3>
        <p>设置大长方体和挖孔长方体的尺寸和位置，点击【开始挖孔】按钮观察从大长方体中挖出小长方体的过程。</p>
      </div>
      
      <div class="input-section">
        <h3>大长方体尺寸</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="outerLength">长度 (X)</label>
            <input type="number" id="outerLength" v-model.number="outerDims.length" min="1" step="1">
          </div>
          <div class="input-group">
            <label for="outerWidth">宽度 (Y)</label>
            <input type="number" id="outerWidth" v-model.number="outerDims.width" min="1" step="1">
          </div>
          <div class="input-group">
            <label for="outerHeight">高度 (Z)</label>
            <input type="number" id="outerHeight" v-model.number="outerDims.height" min="1" step="1">
          </div>
        </div>
      </div>
      
      <div class="input-section">
        <h3>挖孔长方体尺寸</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="innerLength">长度 (X)</label>
            <input type="number" id="innerLength" v-model.number="innerDims.length" min="0.5" step="0.5">
          </div>
          <div class="input-group">
            <label for="innerWidth">宽度 (Y)</label>
            <input type="number" id="innerWidth" v-model.number="innerDims.width" min="0.5" step="0.5">
          </div>
          <div class="input-group">
            <label for="innerHeight">高度 (Z)</label>
            <input type="number" id="innerHeight" v-model.number="innerDims.height" min="0.5" step="0.5">
          </div>
        </div>
      </div>
      
      <div class="input-section">
        <h3>挖孔长方体位置</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="innerX">X 位置</label>
            <input type="number" id="innerX" v-model.number="innerPosition.x" step="0.1">
          </div>
          <div class="input-group">
            <label for="innerY">Y 位置</label>
            <input type="number" id="innerY" v-model.number="innerPosition.y" step="0.1">
          </div>
          <div class="input-group">
            <label for="innerZ">Z 位置</label>
            <input type="number" id="innerZ" v-model.number="innerPosition.z" step="0.1">
          </div>
        </div>
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
      >开始挖孔</button>
      
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
      <h2 class="panel-title">长方体挖孔与表面积变化</h2>

      <div class="concept-card">
        <h3 class="concept-card-title">核心概念</h3>
        <p>从一个长方体中间挖去另一个长方体，会改变原长方体的表面积和体积。</p>
        <p>总表面积 = 原表面积 + 切割体暴露面 - 2×接触面积</p>
      </div>
      
      <h3 class="panel-subtitle">初始状态</h3>
      <p>大长方体尺寸为长 <strong>{{ outerDims.length }}</strong>、宽 <strong>{{ outerDims.width }}</strong>、高 <strong>{{ outerDims.height }}</strong>。</p>
      <p>其初始表面积为 <strong>{{ initialArea.toFixed(2) }}</strong> 平方单位，体积为 <strong>{{ initialVolume.toFixed(2) }}</strong> 立方单位。</p>
      
      <h3 class="panel-subtitle">挖孔长方体</h3>
      <p>挖孔长方体尺寸为长 <strong>{{ innerDims.length }}</strong>、宽 <strong>{{ innerDims.width }}</strong>、高 <strong>{{ innerDims.height }}</strong>。</p>
      <p>挖孔长方体位置为 X: <strong>{{ innerPosition.x.toFixed(1) }}</strong>、Y: <strong>{{ innerPosition.y.toFixed(1) }}</strong>、Z: <strong>{{ innerPosition.z.toFixed(1) }}</strong>。</p>
      <p>挖孔长方体的表面积为 <strong>{{ innerArea.toFixed(2) }}</strong> 平方单位，体积为 <strong>{{ innerVolume.toFixed(2) }}</strong> 立方单位。</p>
      
      <h3 class="panel-subtitle" v-if="isValid">挖孔后的变化</h3>
      <template v-if="isValid">
        <p>挖孔减少的体积: <strong>{{ innerVolume.toFixed(2) }}</strong> 立方单位</p>
        <p>接触面积: <strong>{{ removedArea.toFixed(2) }}</strong> 平方单位（将被扣除两次）</p>
        <p>挖孔后增加的新表面: <strong>{{ addedArea.toFixed(2) }}</strong> 平方单位</p>
        <p>最终表面积计算: <strong>{{ initialArea.toFixed(2) }}</strong> + <strong>{{ addedArea.toFixed(2) }}</strong> - 2×<strong>{{ removedArea.toFixed(2) }}</strong> = <strong>{{ finalArea.toFixed(2) }}</strong> 平方单位</p>
        <p>挖孔后的表面积变化: <strong>{{ areaChange > 0 ? '+' : '' }}{{ areaChange.toFixed(2) }}</strong> 平方单位 (<strong>{{ areaChangePercent.toFixed(2) }}%</strong>)</p>
        <p>挖孔后的剩余体积: <strong>{{ finalVolume.toFixed(2) }}</strong> 立方单位 (减少了 <strong>{{ volumeChangePercent.toFixed(2) }}%</strong>)</p>
      </template>
      <p v-else class="warning-message">挖孔长方体的位置或尺寸无效，请调整参数使其完全位于大长方体内部。</p>
      
      <hr>
      
      <h3 class="panel-subtitle">颜色说明</h3>
      <p class="color-key"><span class="original-color-bg"></span> 代表 <strong>原始</strong> 的外表面</p>
      <p class="color-key"><span class="new-color-bg"></span> 代表 <strong>挖孔后</strong> 新露出的内表面</p>
    </template>
  </TeachingLayout>
</template>

<script>
import * as THREE from 'three'
import TeachingLayout from '@/components/TeachingLayout.vue'
import ThreeScene from '@/components/ThreeScene.vue'

export default {
  name: 'CuboidCutCuboidView',
  components: {
    TeachingLayout,
    ThreeScene
  },
  data() {
    return {
      loading: true,
      errorMessage: '',
      
      // 外部长方体尺寸
      outerDims: {
        length: 10,
        width: 10,
        height: 10
      },
      
      // 内部长方体尺寸
      innerDims: {
        length: 6,
        width: 6,
        height: 6
      },
      
      // 内部长方体位置
      innerPosition: {
        x: 0,
        y: 0,
        z: 2
      },
      
      // 动画相关
      animationSpeed: 1,
      isAnimating: false,
      animationProgress: 0,
      animationDuration: 1.5,
      clock: new THREE.Clock(),
      
      // 场景对象
      scene: null,
      camera: null,
      controls: null,
      
      // 物体
      outerCuboid: null,
      innerCuboid: null,
      
      // 显示对象
      displayGroup: new THREE.Group(),
      
      // 材质
      originalMaterial: null,
      cutMaterial: null,
      wireframeMaterial: null
    }
  },
  computed: {
    // 验证内部长方体是否完全位于外部长方体内
    isValid() {
      const { x, y, z } = this.innerPosition
      const { length: iL, width: iW, height: iH } = this.innerDims
      const { length: oL, width: oW, height: oH } = this.outerDims
      
      // 内部长方体的最小/最大坐标
      const innerMinX = x - iL / 2
      const innerMaxX = x + iL / 2
      const innerMinY = y - iW / 2
      const innerMaxY = y + iW / 2
      const innerMinZ = z - iH / 2
      const innerMaxZ = z + iH / 2
      
      // 外部长方体的最小/最大坐标
      const outerMinX = -oL / 2
      const outerMaxX = oL / 2
      const outerMinY = -oW / 2
      const outerMaxY = oW / 2
      const outerMinZ = -oH / 2
      const outerMaxZ = oH / 2
      
      // 检查内部长方体是否完全位于外部长方体内（允许边界接触）
      return (
        innerMinX >= outerMinX && innerMaxX <= outerMaxX &&
        innerMinY >= outerMinY && innerMaxY <= outerMaxY &&
        innerMinZ >= outerMinZ && innerMaxZ <= outerMaxZ
      )
    },
    
    // 计算初始表面积
    initialArea() {
      const { length, width, height } = this.outerDims
      return 2 * (length * width + length * height + width * height)
    },
    
    // 计算初始体积
    initialVolume() {
      const { length, width, height } = this.outerDims
      return length * width * height
    },
    
    // 计算内部长方体表面积
    innerArea() {
      const { length, width, height } = this.innerDims
      return 2 * (length * width + length * height + width * height)
    },
    
    // 计算内部长方体体积
    innerVolume() {
      const { length, width, height } = this.innerDims
      return length * width * height
    },
    
    // 计算减少的表面积（被挖掉的部分）
    removedArea() {
      // 计算内部长方体与外部长方体的接触面积
      // 这是挖孔后暴露的新表面积
      
      if (!this.isValid) return 0
      
      // 获取内外长方体的尺寸
      const { length: iL, width: iW, height: iH } = this.innerDims
      const { x: iPosX, y: iPosY, z: iPosZ } = this.innerPosition
      const { length: oL, width: oW, height: oH } = this.outerDims
      
      // 计算内部长方体的各个面的坐标
      const iMinX = iPosX - iL/2
      const iMaxX = iPosX + iL/2
      const iMinY = iPosY - iW/2
      const iMaxY = iPosY + iW/2
      const iMinZ = iPosZ - iH/2
      const iMaxZ = iPosZ + iH/2
      
      // 计算外部长方体的各个面的坐标
      const oMinX = -oL/2
      const oMaxX = oL/2
      const oMinY = -oW/2
      const oMaxY = oW/2
      const oMinZ = -oH/2
      const oMaxZ = oH/2
      
      // 初始化接触面积
      let contactArea = 0
      
      // 检查内部长方体的每个面是否与外部长方体接触
      
      // X方向的面 (长度方向)
      if (Math.abs(iMinX - oMinX) < 0.001) {
        // 内部左面与外部左面接触
        const contactWidth = Math.min(iMaxY - iMinY, oMaxY - oMinY)
        const contactHeight = Math.min(iMaxZ - iMinZ, oMaxZ - oMinZ)
        contactArea += contactWidth * contactHeight
      }
      else if (Math.abs(iMaxX - oMaxX) < 0.001) {
        // 内部右面与外部右面接触
        const contactWidth = Math.min(iMaxY - iMinY, oMaxY - oMinY)
        const contactHeight = Math.min(iMaxZ - iMinZ, oMaxZ - oMinZ)
        contactArea += contactWidth * contactHeight
      }
      
      // Y方向的面 (宽度方向)
      if (Math.abs(iMinY - oMinY) < 0.001) {
        // 内部前面与外部前面接触
        const contactLength = Math.min(iMaxX - iMinX, oMaxX - oMinX)
        const contactHeight = Math.min(iMaxZ - iMinZ, oMaxZ - oMinZ)
        contactArea += contactLength * contactHeight
      }
      else if (Math.abs(iMaxY - oMaxY) < 0.001) {
        // 内部后面与外部后面接触
        const contactLength = Math.min(iMaxX - iMinX, oMaxX - oMinX)
        const contactHeight = Math.min(iMaxZ - iMinZ, oMaxZ - oMinZ)
        contactArea += contactLength * contactHeight
      }
      
      // Z方向的面 (高度方向)
      if (Math.abs(iMinZ - oMinZ) < 0.001) {
        // 内部底面与外部底面接触
        const contactLength = Math.min(iMaxX - iMinX, oMaxX - oMinX)
        const contactWidth = Math.min(iMaxY - iMinY, oMaxY - oMinY)
        contactArea += contactLength * contactWidth
      }
      else if (Math.abs(iMaxZ - oMaxZ) < 0.001) {
        // 内部顶面与外部顶面接触
        const contactLength = Math.min(iMaxX - iMinX, oMaxX - oMinX)
        const contactWidth = Math.min(iMaxY - iMinY, oMaxY - oMinY)
        contactArea += contactLength * contactWidth
      }
      
      return contactArea
    },
    
    // 计算添加的表面积（内部长方体暴露出来的表面积）
    addedArea() {
      if (!this.isValid) return 0
      
      // 计算内部长方体的总表面积
      const { length, width, height } = this.innerDims
      const totalInnerArea = 2 * (length * width + length * height + width * height)
      
      // 减去与外部长方体接触的面积（即被移除的表面积）
      return totalInnerArea - this.removedArea
    },
    
    // 计算最终表面积
    finalArea() {
      if (!this.isValid) return this.initialArea
      return this.initialArea - this.removedArea + this.addedArea
    },
    
    // 计算表面积变化
    areaChange() {
      return this.finalArea - this.initialArea
    },
    
    // 计算表面积变化百分比
    areaChangePercent() {
      return (this.areaChange / this.initialArea) * 100
    },
    
    // 计算最终体积
    finalVolume() {
      if (!this.isValid) return this.initialVolume
      return this.initialVolume - this.innerVolume
    },
    
    // 计算体积变化百分比
    volumeChangePercent() {
      return (this.innerVolume / this.initialVolume) * 100
    }
  },
  methods: {
    onSceneReady(sceneObjects) {
      // 保存场景对象
      this.scene = sceneObjects.scene
      this.camera = sceneObjects.camera
      this.controls = sceneObjects.controls
      
      // 设置材质
      this.originalMaterial = new THREE.MeshPhongMaterial({
        color: 0x6495ED, // 蓝色
        specular: 0x222222,
        shininess: 30,
        side: THREE.DoubleSide
      })
      
      this.cutMaterial = new THREE.MeshPhongMaterial({
        color: 0xFA8072, // 红色
        specular: 0x222222,
        shininess: 30,
        side: THREE.DoubleSide
      })
      
      // 添加显示组到场景
      this.scene.add(this.displayGroup)
      
      // 创建初始模型
      this.createModels()
      
      // 设置相机位置
      this.resetView()
      
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
        
        // 完成动画，显示最终结果
        this.showFinalResult()
      } else {
        // 更新动画
        this.updateAnimation()
      }
    },
    
    createModels() {
      // 清空场景
      while (this.displayGroup.children.length > 0) {
        const object = this.displayGroup.children[0]
        this.displayGroup.remove(object)
        
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose())
          } else {
            object.material.dispose()
          }
        }
      }
      
      // 创建外部长方体
      const outerGeometry = new THREE.BoxGeometry(
        this.outerDims.length,
        this.outerDims.height,
        this.outerDims.width
      )
      
      // 创建外部长方体材质
      const outerMat = this.originalMaterial.clone()
      outerMat.transparent = true
      outerMat.opacity = 0.6
      
      this.outerCuboid = new THREE.Mesh(outerGeometry, outerMat)
      this.displayGroup.add(this.outerCuboid)
      
      // 添加边框线
      const outerEdges = new THREE.EdgesGeometry(outerGeometry)
      const outerLine = new THREE.LineSegments(
        outerEdges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      )
      this.outerCuboid.add(outerLine)
      
      // 添加坐标轴辅助
      const axesHelper = new THREE.AxesHelper(this.outerDims.length * 0.6)
      this.displayGroup.add(axesHelper)
    },
    
    showFinalResult() {
      // 清除场景中所有对象
      while (this.displayGroup.children.length > 0) {
        const object = this.displayGroup.children[0]
        this.displayGroup.remove(object)
      }
      
      // 如果位置无效，只显示外部立方体
      if (!this.isValid) {
        // 添加外部长方体（不透明）
        const outerCuboid = new THREE.Mesh(
          new THREE.BoxGeometry(
            this.outerDims.length,
            this.outerDims.height,
            this.outerDims.width
          ),
          this.originalMaterial.clone()
        )
        
        // 添加边框
        const outerEdges = new THREE.EdgesGeometry(outerCuboid.geometry)
        const outerLines = new THREE.LineSegments(
          outerEdges,
          new THREE.LineBasicMaterial({ color: 0x000000 })
        )
        outerCuboid.add(outerLines)
        
        this.displayGroup.add(outerCuboid)
        return
      }
      
      // 使用重叠的两个立方体来显示"挖孔"效果
      
      // 1. 创建外部长方体（半透明蓝色）
      const outerMat = new THREE.MeshPhongMaterial({
        color: 0x6495ED,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      })
      
      const outerCuboid = new THREE.Mesh(
        new THREE.BoxGeometry(
          this.outerDims.length,
          this.outerDims.height,
          this.outerDims.width
        ),
        outerMat
      )
      
      // 2. 创建内部长方体（红色，完全不透明）
      const innerMat = new THREE.MeshPhongMaterial({
        color: 0xFA8072,
        transparent: false,
        opacity: 1.0,
        side: THREE.DoubleSide
      })
      
      const innerCuboid = new THREE.Mesh(
        new THREE.BoxGeometry(
          this.innerDims.length,
          this.innerDims.height,
          this.innerDims.width
        ),
        innerMat
      )
      
      // 设置内部长方体位置
      const { x, y, z } = this.innerPosition
      innerCuboid.position.set(x, z, y)
      
      // 3. 添加边框以增强立体感
      const outerEdges = new THREE.EdgesGeometry(outerCuboid.geometry)
      const outerLines = new THREE.LineSegments(
        outerEdges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      )
      outerCuboid.add(outerLines)
      
      const innerEdges = new THREE.EdgesGeometry(innerCuboid.geometry)
      const innerLines = new THREE.LineSegments(
        innerEdges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      )
      innerCuboid.add(innerLines)
      
      // 4. 添加到场景 - 注意顺序，先外部后内部
      this.displayGroup.add(outerCuboid)
      this.displayGroup.add(innerCuboid)
      
      // 5. 添加坐标轴辅助
      const axesHelper = new THREE.AxesHelper(this.outerDims.length * 0.6)
      this.displayGroup.add(axesHelper)
    },
    
    startCutAnimation() {
      // 验证参数
      if (!this.validateInputs()) return
      
      // 重置动画状态
      this.animationProgress = 0
      this.isAnimating = true
      
      // 重新创建模型
      this.createModels()
    },
    
    validateInputs() {
      this.errorMessage = ''
      
      // 验证外部长方体尺寸
      const { length: oL, width: oW, height: oH } = this.outerDims
      if (oL <= 0 || oW <= 0 || oH <= 0) {
        this.errorMessage = '大长方体尺寸必须为正数。'
        return false
      }
      
      // 验证内部长方体尺寸
      const { length: iL, width: iW, height: iH } = this.innerDims
      if (iL <= 0 || iW <= 0 || iH <= 0) {
        this.errorMessage = '挖孔长方体尺寸必须为正数。'
        return false
      }
      
      // 验证内部长方体是否能够放入外部长方体
      if (iL > oL || iW > oW || iH > oH) {
        this.errorMessage = '挖孔长方体尺寸必须小于或等于大长方体尺寸。'
        return false
      }
      
      // 验证内部长方体位置
      if (!this.isValid) {
        this.errorMessage = '挖孔长方体必须完全位于大长方体内部。'
        return false
      }
      
      return true
    },
    
    resetView() {
      if (!this.camera || !this.controls) return
      
      // 计算合适的相机位置
      const maxDim = Math.max(
        this.outerDims.length,
        this.outerDims.width,
        this.outerDims.height
      )
      
      const distance = maxDim * 2
      
      // 设置相机位置 - 从前上方观察
      this.camera.position.set(distance * 0.8, distance * 0.6, distance * 0.8)
      this.camera.lookAt(0, 0, 0)
      
      // 更新控制器
      this.controls.target.set(0, 0, 0)
      this.controls.update()
    },
    
    // 缓动函数
    easeInOutCubic(t) {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    },
    
    updateAnimation() {
      if (!this.isValid) return
      
      // 使用缓动函数使动画更平滑
      const easedProgress = this.easeInOutCubic(this.animationProgress)
      
      // 清除所有对象
      while (this.displayGroup.children.length > 0) {
        const object = this.displayGroup.children[0]
        this.displayGroup.remove(object)
      }
      
      // 添加外部长方体（半透明）
      const outerMat = new THREE.MeshPhongMaterial({
        color: 0x6495ED,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      })
      
      const outerCuboid = new THREE.Mesh(
        new THREE.BoxGeometry(
          this.outerDims.length,
          this.outerDims.height,
          this.outerDims.width
        ),
        outerMat
      )
      
      // 添加边框
      const outerEdges = new THREE.EdgesGeometry(outerCuboid.geometry)
      const outerLines = new THREE.LineSegments(
        outerEdges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      )
      outerCuboid.add(outerLines)
      
      this.displayGroup.add(outerCuboid)
      
      // 内部长方体动画
      const innerMat = new THREE.MeshPhongMaterial({
        color: 0xFA8072,
        transparent: true,
        opacity: easedProgress,
        side: THREE.DoubleSide
      })
      
      const innerCuboid = new THREE.Mesh(
        new THREE.BoxGeometry(
          this.innerDims.length,
          this.innerDims.height,
          this.innerDims.width
        ),
        innerMat
      )
      
      // 计算内部长方体位置
      const { x, y, z } = this.innerPosition
      const moveDistance = 3 * (1 - easedProgress) // 移动距离随进度减少
      
      // 内部长方体从外侧移入
      innerCuboid.position.set(
        x, 
        z, 
        y + moveDistance
      )
      
      // 添加边框
      const innerEdges = new THREE.EdgesGeometry(innerCuboid.geometry)
      const innerLines = new THREE.LineSegments(
        innerEdges,
        new THREE.LineBasicMaterial({ 
          color: 0x000000,
          transparent: true,
          opacity: easedProgress
        })
      )
      innerCuboid.add(innerLines)
      
      this.displayGroup.add(innerCuboid)
      
      // 添加坐标轴
      const axesHelper = new THREE.AxesHelper(this.outerDims.length * 0.6)
      this.displayGroup.add(axesHelper)
    }
  },
  watch: {
    // 当参数变化时更新模型（仅在非动画状态）
    'outerDims.length'() {
      if (!this.isAnimating) this.createModels()
    },
    'outerDims.width'() {
      if (!this.isAnimating) this.createModels()
    },
    'outerDims.height'() {
      if (!this.isAnimating) this.createModels()
    },
    'innerDims.length'() {
      if (!this.isAnimating) this.createModels()
    },
    'innerDims.width'() {
      if (!this.isAnimating) this.createModels()
    },
    'innerDims.height'() {
      if (!this.isAnimating) this.createModels()
    },
    'innerPosition.x'() {
      if (!this.isAnimating) this.createModels()
    },
    'innerPosition.y'() {
      if (!this.isAnimating) this.createModels()
    },
    'innerPosition.z'() {
      if (!this.isAnimating) this.createModels()
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
.input-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--bg-white);
  box-shadow: 0 0 0 3px rgba(74, 108, 212, 0.25);
}

.error-message, .warning-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
  font-size: 0.9em;
}

.warning-message {
  color: var(--secondary-color);
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
</style> 