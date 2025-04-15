<template>
  <TeachingLayout :loading="loading">
    <!-- 控制面板插槽 -->
    <template #control-panel>
      <h2 class="panel-title">控制操作区</h2>
      
      <div class="concept-card">
        <h3 class="concept-card-title">提示</h3>
        <p>点击已有长方体的面，将在旁边添加设定尺寸的新长方体。连接处会用红色线条标示。</p>
      </div>
      
      <div class="input-section">
        <h3>初始长方体尺寸</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="initialL">长度 (X)</label>
            <input type="number" id="initialL" v-model.number="initialDims.L" min="0.1" step="0.1">
          </div>
          <div class="input-group">
            <label for="initialW">宽度 (Y)</label>
            <input type="number" id="initialW" v-model.number="initialDims.W" min="0.1" step="0.1">
          </div>
          <div class="input-group">
            <label for="initialH">高度 (Z)</label>
            <input type="number" id="initialH" v-model.number="initialDims.H" min="0.1" step="0.1">
          </div>
        </div>
        <small>(仅在"重置场景"时使用)</small>
      </div>
      
      <div class="input-section">
        <h3>下一个长方体尺寸</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="nextL">长度 (X)</label>
            <input type="number" id="nextL" v-model.number="nextDims.L" min="0.1" step="0.1">
          </div>
          <div class="input-group">
            <label for="nextW">宽度 (Y)</label>
            <input type="number" id="nextW" v-model.number="nextDims.W" min="0.1" step="0.1">
          </div>
          <div class="input-group">
            <label for="nextH">高度 (Z)</label>
            <input type="number" id="nextH" v-model.number="nextDims.H" min="0.1" step="0.1">
          </div>
        </div>
        <small>(点击添加时使用此尺寸)</small>
      </div>
      
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      
      <button 
        class="action-button" 
        @click="resetScene"
        :disabled="isAnimating"
      >重置场景</button>
      
      <div class="interaction-tip">
        <strong>互动提示：</strong>点击已有长方体的面添加新长方体。拖动旋转，滚轮缩放。
      </div>
      
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
      <h2 class="panel-title">长方体堆叠与表面积</h2>

      <div class="concept-card">
        <h3 class="concept-card-title">核心概念</h3>
        <p>每添加一个长方体并使其与现有结构的一个面接触时，会影响总表面积的计算。</p>
      </div>
      
      <h3 class="panel-subtitle">堆叠过程 & 原理</h3>
      <p>点击已有长方体的<span class="color-key"><span class="original-color-bg"></span>蓝色</span>面，即可在旁边添加设定尺寸的新长方体。连接处用<span class="color-key"><span class="new-color-bg"></span>红色</span>线条标示。</p>
      <p>每次添加时：</p>
      <ul>
        <li>理论上，表面积先增加新长方体的完整表面积。</li>
        <li>但由于接触，实际表面积会<span class="highlight">减少</span><b>2倍</b>的接触面面积。</li>
        <li>接触面面积 = 两个接触面中重叠部分的面积。</li>
      </ul>
      
      <hr>
      
      <h3 class="panel-subtitle">计算结果</h3>
      <p>长方体数量: <strong>{{ cuboids.length }}</strong> | 连接次数: <strong>{{ numJoins }}</strong></p>
      <p>总独立表面积: <strong>{{ totalSeparateArea.toFixed(2) }}</strong></p>
      <p class="calc-step">= 对所有长方体求和 [ 2 × (长×宽 + 长×高 + 宽×高) ]</p>
      <p>因连接<strong style="color: var(--new-surface);">减少</strong>的总面积: <strong>{{ totalLostAreaAccumulated.toFixed(2) }}</strong></p>
      <p class="calc-step">= 对所有连接求和 [ 2 × 接触面积 ]</p>
      <p>最终结构表面积: <strong>{{ finalArea.toFixed(2) }}</strong></p>
      <p class="calc-step">= (总独立表面积) - (总减少面积)</p>
      
      <hr>
      
      <h3 class="panel-subtitle">颜色说明</h3>
      <p class="color-key"><span class="original-color-bg"></span> 代表 <strong>长方体</strong> 的表面</p>
      <p class="color-key"><span class="new-color-bg"></span> 代表 <strong>连接处</strong> 的边线</p>
    </template>
  </TeachingLayout>
</template>

<script>
import * as THREE from 'three'
import TeachingLayout from '@/components/TeachingLayout.vue'
import ThreeScene from '@/components/ThreeScene.vue'

export default {
  name: 'CuboidJoinView',
  components: {
    TeachingLayout,
    ThreeScene
  },
  data() {
    return {
      loading: true,
      errorMessage: '',
      
      // 初始长方体尺寸
      initialDims: {
        L: 3,
        W: 2,
        H: 2
      },
      
      // 下一个长方体尺寸
      nextDims: {
        L: 2,
        W: 2,
        H: 2
      },
      
      // 场景对象
      scene: null,
      camera: null,
      controls: null,
      
      // 动画相关
      isAnimating: false,
      clock: new THREE.Clock(),
      animationDuration: 0.6,
      addStartDistanceFactor: 1.0,
      
      // 长方体相关
      cuboids: [],
      edgeLines: [],
      numJoins: 0,
      totalLostAreaAccumulated: 0,
      
      // 光线投射
      raycaster: new THREE.Raycaster(),
      pointer: new THREE.Vector2(),
      
      // 材质
      cubeBaseColor: 0x6495ED,
      joinLineColor: 0xdc3545,
      errorIndicatorColor: 0xff0000,
      cuboidMaterial: null,
      lineMaterial: null,
      errorMaterial: null,
      
      // 动画与错误提示
      activeAddition: null,
      errorIndicatorTimeout: null,
      errorIndicatorMesh: null
    }
  },
  computed: {
    totalSeparateArea() {
      if (this.cuboids.length === 0) return 0
      
      let area = 0
      this.cuboids.forEach(cuboid => {
        const dims = cuboid.userData.dims
        area += 2 * (dims.L * dims.W + dims.L * dims.H + dims.W * dims.H)
      })
      
      return area
    },
    finalArea() {
      return this.totalSeparateArea - this.totalLostAreaAccumulated
    }
  },
  methods: {
    onSceneReady(sceneObjects) {
      // 保存场景对象
      this.scene = sceneObjects.scene
      this.camera = sceneObjects.camera
      this.controls = sceneObjects.controls
      
      // 设置材质
      this.cuboidMaterial = new THREE.MeshStandardMaterial({ 
        color: this.cubeBaseColor, 
        roughness: 0.6, 
        metalness: 0.2,
        side: THREE.FrontSide 
      })
      
      this.lineMaterial = new THREE.LineBasicMaterial({ 
        color: this.joinLineColor, 
        linewidth: 2, 
        depthTest: false 
      })
      
      this.errorMaterial = new THREE.MeshBasicMaterial({
        color: this.errorIndicatorColor,
        transparent: true,
        opacity: 0.6,
        depthTest: false
      })
      
      // 添加事件监听
      this.scene.userData.domElement = sceneObjects.renderer.domElement
      sceneObjects.renderer.domElement.addEventListener('pointerdown', this.onPointerDown)
      
      // 初始化场景
      this.resetScene()
      
      this.loading = false
    },
    
    onAnimationFrame() {
      this.updateAddAnimation()
    },
    
    validateDimsInput(dims, inputName) {
      this.errorMessage = ''
      
      const { L, W, H } = dims
      
      if (isNaN(L) || L <= 0 || isNaN(W) || W <= 0 || isNaN(H) || H <= 0) {
        this.errorMessage = `${inputName}尺寸必须是正数。`
        return false
      }
      
      return true
    },
    
    resetScene() {
      // 禁用按钮防止重复点击
      this.loading = true
      this.activeAddition = null
      
      // 清除错误指示器
      this.clearErrorIndicator()
      
      // 清除场景中的所有对象
      this.cuboids.forEach(c => {
        this.scene.remove(c)
        if (c.geometry) c.geometry.dispose()
        if (c.material) c.material.dispose()
      })
      
      this.edgeLines.forEach(l => {
        this.scene.remove(l)
        if (l.geometry) l.geometry.dispose()
      })
      
      this.cuboids = []
      this.edgeLines = []
      this.numJoins = 0
      this.totalLostAreaAccumulated = 0
      
      // 验证输入
      if (!this.validateDimsInput(this.initialDims, "初始")) {
        this.loading = false
        return
      }
      
      // 创建初始长方体
      const initialCuboid = this.createCuboidMesh(new THREE.Vector3(0, 0, 0), this.initialDims)
      this.scene.add(initialCuboid)
      this.cuboids.push(initialCuboid)
      
      // 创建边线
      const initialLines = this.createEdgeLines(initialCuboid.geometry, initialCuboid.position, initialCuboid.quaternion)
      this.scene.add(initialLines)
      this.edgeLines.push(initialLines)
      
      // 调整相机
      this.updateCamera()
      
      this.loading = false
    },
    
    createCuboidMesh(position, dims) {
      // 创建长方体几何体
      const cuboidGeo = new THREE.BoxGeometry(dims.L, dims.W, dims.H)
      const cuboidMat = this.cuboidMaterial.clone()
      const cuboid = new THREE.Mesh(cuboidGeo, cuboidMat)
      
      cuboid.position.copy(position)
      cuboid.userData.isCuboid = true
      cuboid.userData.center = position.clone()
      cuboid.userData.dims = { ...dims }
      
      return cuboid
    },
    
    createEdgeLines(geometry, position, quaternion) {
      // 创建边线
      const edges = new THREE.EdgesGeometry(geometry)
      const lines = new THREE.LineSegments(edges, this.lineMaterial)
      
      lines.position.copy(position)
      lines.quaternion.copy(quaternion)
      lines.renderOrder = 1
      
      return lines
    },
    
    checkPositionOccupied(targetPos, newDims) {
      // 使用AABB碰撞检测
      const newMin = { 
        x: targetPos.x - newDims.L / 2, 
        y: targetPos.y - newDims.W / 2, 
        z: targetPos.z - newDims.H / 2 
      }
      
      const newMax = { 
        x: targetPos.x + newDims.L / 2, 
        y: targetPos.y + newDims.W / 2, 
        z: targetPos.z + newDims.H / 2 
      }
      
      const tolerance = 1e-6 // 小容差值，处理浮点数精度问题
      
      for (const cuboid of this.cuboids) {
        const existingPos = cuboid.position
        const existingDims = cuboid.userData.dims
        
        const existingMin = { 
          x: existingPos.x - existingDims.L / 2, 
          y: existingPos.y - existingDims.W / 2, 
          z: existingPos.z - existingDims.H / 2 
        }
        
        const existingMax = { 
          x: existingPos.x + existingDims.L / 2, 
          y: existingPos.y + existingDims.W / 2, 
          z: existingPos.z + existingDims.H / 2 
        }
        
        const overlapX = (newMax.x > existingMin.x + tolerance) && (newMin.x < existingMax.x - tolerance)
        const overlapY = (newMax.y > existingMin.y + tolerance) && (newMin.y < existingMax.y - tolerance)
        const overlapZ = (newMax.z > existingMin.z + tolerance) && (newMin.z < existingMax.z - tolerance)
        
        if (overlapX && overlapY && overlapZ) {
          return true
        }
      }
      
      return false
    },
    
    clearErrorIndicator() {
      // 清除错误指示器
      if (this.errorIndicatorTimeout) {
        clearTimeout(this.errorIndicatorTimeout)
        this.errorIndicatorTimeout = null
      }
      
      const existingIndicator = this.scene ? this.scene.getObjectByName("errorIndicator") : null
      if (existingIndicator) {
        this.scene.remove(existingIndicator)
        if (existingIndicator.geometry) existingIndicator.geometry.dispose()
      }
    },
    
    showErrorIndicator(position) {
      this.errorMessage = '该位置已被占用。'
      
      // 清除现有的错误指示器
      this.clearErrorIndicator()
      
      // 创建新的错误指示器
      const indicatorSize = Math.min(this.nextDims.L, this.nextDims.W, this.nextDims.H) * 0.25
      const indicatorGeo = new THREE.SphereGeometry(indicatorSize, 16, 8)
      this.errorIndicatorMesh = new THREE.Mesh(indicatorGeo, this.errorMaterial)
      this.errorIndicatorMesh.name = "errorIndicator"
      this.errorIndicatorMesh.position.copy(position)
      this.errorIndicatorMesh.renderOrder = 2
      this.scene.add(this.errorIndicatorMesh)
      
      // 设置超时自动清除
      this.errorIndicatorTimeout = setTimeout(() => {
        this.clearErrorIndicator()
      }, 1000)
    },
    
    onPointerDown(event) {
      if (this.activeAddition) return
      
      // 验证输入
      if (!this.validateDimsInput(this.nextDims, "下一个")) return
      
      // 清除错误信息
      this.errorMessage = ''
      this.clearErrorIndicator()
      
      // 计算鼠标位置
      const rect = this.scene.userData.domElement.getBoundingClientRect()
      this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      // 设置光线投射
      this.raycaster.setFromCamera(this.pointer, this.camera)
      const intersects = this.raycaster.intersectObjects(this.cuboids)
      
      if (intersects.length > 0) {
        const intersect = intersects[0]
        const clickedCuboid = intersect.object
        const faceNormal = intersect.face.normal.clone()
        const clickedDims = clickedCuboid.userData.dims
        
        // 确定偏移距离
        let offsetDistance = 0
        if (Math.abs(faceNormal.x) > 0.5) {
          offsetDistance = (clickedDims.L / 2) + (this.nextDims.L / 2)
        } else if (Math.abs(faceNormal.y) > 0.5) {
          offsetDistance = (clickedDims.W / 2) + (this.nextDims.W / 2)
        } else {
          offsetDistance = (clickedDims.H / 2) + (this.nextDims.H / 2)
        }
        
        // 确定目标位置
        const targetPos = clickedCuboid.position.clone().addScaledVector(faceNormal, offsetDistance)
        
        if (!this.checkPositionOccupied(targetPos, this.nextDims)) {
          // 从远处开始添加动画
          const startPos = targetPos.clone().addScaledVector(
            faceNormal, 
            Math.max(this.nextDims.L, this.nextDims.W, this.nextDims.H) * this.addStartDistanceFactor
          )
          
          const newCuboidMesh = this.createCuboidMesh(startPos, this.nextDims)
          this.startAddAnimation(newCuboidMesh, startPos, targetPos, clickedDims, this.nextDims, faceNormal)
        } else {
          // 显示错误指示器
          this.showErrorIndicator(targetPos)
        }
      }
    },
    
    startAddAnimation(cuboidMesh, startPos, targetPos, clickedDims, nextDims, faceNormal) {
      if (this.activeAddition) return
      
      this.scene.add(cuboidMesh)
      this.isAnimating = true
      
      this.activeAddition = {
        mesh: cuboidMesh,
        startPos: startPos.clone(),
        targetPos: targetPos.clone(),
        startTime: this.clock.getElapsedTime(),
        clickedDims: clickedDims,
        nextDims: nextDims,
        faceNormal: faceNormal.clone()
      }
    },
    
    updateAddAnimation() {
      if (!this.activeAddition) return
      
      const elapsedTime = this.clock.getElapsedTime() - this.activeAddition.startTime
      let progress = Math.min(elapsedTime / this.animationDuration, 1)
      
      // 缓动函数
      progress = progress * progress * (3 - 2 * progress)
      
      this.activeAddition.mesh.position.lerpVectors(
        this.activeAddition.startPos,
        this.activeAddition.targetPos,
        progress
      )
      
      if (elapsedTime >= this.animationDuration) {
        // 动画完成
        const finishedMesh = this.activeAddition.mesh
        finishedMesh.position.copy(this.activeAddition.targetPos)
        
        // 创建边线
        const newLines = this.createEdgeLines(
          finishedMesh.geometry,
          finishedMesh.position,
          finishedMesh.quaternion
        )
        
        this.scene.add(newLines)
        this.edgeLines.push(newLines)
        
        // 添加到长方体列表
        this.cuboids.push(finishedMesh)
        this.numJoins++
        
        // 计算接触面积
        let contactArea = 0
        const d1 = this.activeAddition.clickedDims
        const d2 = this.activeAddition.nextDims
        const n = this.activeAddition.faceNormal
        
        if (Math.abs(n.x) > 0.5) {
          contactArea = Math.min(d1.W, d2.W) * Math.min(d1.H, d2.H)
        } else if (Math.abs(n.y) > 0.5) {
          contactArea = Math.min(d1.L, d2.L) * Math.min(d1.H, d2.H)
        } else {
          contactArea = Math.min(d1.L, d2.L) * Math.min(d1.W, d2.W)
        }
        
        // 更新总减少面积
        const lostAreaThisJoin = 2 * contactArea
        this.totalLostAreaAccumulated += lostAreaThisJoin
        
        // 更新相机
        this.updateCamera()
        
        // 重置动画状态
        this.activeAddition = null
        this.isAnimating = false
      }
    },
    
    updateCamera() {
      if (this.cuboids.length === 0) {
        this.camera.position.set(5, 4, 7)
        this.controls.target.set(0, 0, 0)
        this.controls.update()
        return
      }
      
      // 创建包围盒
      const box = new THREE.Box3()
      this.cuboids.forEach(c => box.expandByObject(c))
      
      const center = new THREE.Vector3()
      const size = new THREE.Vector3()
      
      box.getCenter(center)
      box.getSize(size)
      
      const maxSize = Math.max(size.x, size.y, size.z)
      const cameraDist = maxSize * 2.0
      
      // 设置相机位置
      this.camera.position.set(
        center.x + cameraDist * 0.6,
        center.y + cameraDist * 0.5,
        center.z + cameraDist * 0.8
      )
      
      this.camera.lookAt(center)
      
      // 更新控制器
      this.controls.target.copy(center)
      this.controls.minDistance = maxSize * 0.5
      this.controls.maxDistance = maxSize * 5
      this.controls.update()
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

.input-section small {
  font-size: 0.75em;
  color: var(--secondary-color);
  display: block;
  margin-top: 3px;
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
  margin-bottom: 3px;
  font-size: 0.8em;
  color: var(--secondary-color);
}

.input-group input[type="number"] {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.9em;
  background-color: var(--bg-white);
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--bg-white);
  box-shadow: 0 0 0 2px rgba(74, 108, 212, 0.25);
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
  font-size: 0.9em;
  min-height: 1.2em;
}

.calc-step {
  margin-left: 15px;
  font-size: 0.85em;
  color: var(--secondary-color);
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