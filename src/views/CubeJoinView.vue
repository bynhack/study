<template>
  <TeachingLayout :loading="loading">
    <!-- 控制面板插槽 -->
    <template #control-panel>
      <h2 class="panel-title">控制操作区</h2>
      
      <div class="concept-card">
        <h3 class="concept-card-title">提示</h3>
        <p>点击场景中任意正方体的一个面，将在该面上添加一个新的相同正方体。连接处会用红色线条标示。</p>
      </div>
      
      <div class="input-group">
        <label for="cubeSide">正方体边长</label>
        <input 
          type="number" 
          id="cubeSide" 
          v-model.number="cubeSide" 
          min="0.1" 
          step="0.1"
          @change="validateInput"
        >
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      
      <button 
        class="action-button" 
        @click="resetScene"
        :disabled="isAnimating"
      >重置场景</button>
      
      <div class="interaction-tip">
        <strong>互动提示：</strong>点击任意正方体的面添加新方块。拖动旋转，滚轮缩放。
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
      <h2 class="panel-title">正方体堆叠与表面积</h2>

      <div class="concept-card">
        <h3 class="concept-card-title">核心概念</h3>
        <p>每添加一个正方体并使其与现有结构的一个面接触时，会影响总表面积的计算。</p>
      </div>
      
      <h3 class="panel-subtitle">表面积变化原理</h3>
      <p>每添加一个正方体并使其与现有结构的一个面接触时：</p>
      <ul>
        <li>新添加的正方体贡献了6个面的面积。</li>
        <li>但接触的<strong>2</strong>个面变为了内部表面。</li>
        <li>因此，每次添加操作使总表面积净增加<strong>4</strong>个面的面积。</li>
      </ul>
      <p>总表面积 = (初始方块面积) + (添加方块数 × 4 × 单面面积)</p>
      
      <hr>
      
      <h3 class="panel-subtitle">计算结果</h3>
      <p>方块数量: <strong>{{ cubes.length }}</strong> | 连接面数: <strong>{{ numJoinedFaces }}</strong></p>
      <p>单个方块表面积: <strong>{{ singleCubeArea.toFixed(2) }}</strong></p>
      <p>总独立表面积: <strong>{{ totalSeparateArea.toFixed(2) }}</strong></p>
      <p>因连接<strong style="color: var(--new-surface);">减少</strong>的总面积: <strong>{{ totalLostArea.toFixed(2) }}</strong></p>
      <p>最终结构表面积: <strong>{{ finalArea.toFixed(2) }}</strong></p>
      
      <hr>
      
      <h3 class="panel-subtitle">颜色说明</h3>
      <p class="color-key"><span class="original-color-bg"></span> 代表 <strong>方块</strong> 的表面</p>
      <p class="color-key"><span class="new-color-bg"></span> 代表 <strong>连接处</strong> 的边线</p>
    </template>
  </TeachingLayout>
</template>

<script>
import * as THREE from 'three'
import TeachingLayout from '@/components/TeachingLayout.vue'
import ThreeScene from '@/components/ThreeScene.vue'

export default {
  name: 'CubeJoinView',
  components: {
    TeachingLayout,
    ThreeScene
  },
  data() {
    return {
      loading: true,
      errorMessage: '',
      cubeSide: 2,
      
      // 场景对象
      scene: null,
      camera: null,
      controls: null,
      
      // 动画相关
      isAnimating: false,
      clock: new THREE.Clock(),
      animationDuration: 0.6,
      addStartDistanceFactor: 1.5,
      
      // 正方体相关
      cubes: [],
      edgeLines: [],
      numJoinedFaces: 0,
      
      // 光线投射
      raycaster: new THREE.Raycaster(),
      pointer: new THREE.Vector2(),
      
      // 材质
      cubeBaseColor: 0x6495ED,
      joinLineColor: 0xdc3545,
      cubeMaterial: null,
      lineMaterial: null,
      
      // 动画
      activeAddition: null
    }
  },
  computed: {
    singleCubeArea() {
      const side = this.cubeSide
      return 6 * side * side
    },
    totalSeparateArea() {
      return this.cubes.length * this.singleCubeArea
    },
    totalLostArea() {
      return this.numJoinedFaces * 2 * (this.cubeSide * this.cubeSide)
    },
    finalArea() {
      return this.totalSeparateArea - this.totalLostArea
    }
  },
  methods: {
    onSceneReady(sceneObjects) {
      // 保存场景对象
      this.scene = sceneObjects.scene
      this.camera = sceneObjects.camera
      this.controls = sceneObjects.controls
      
      // 设置材质
      this.cubeMaterial = new THREE.MeshStandardMaterial({ 
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
    
    validateInput() {
      this.errorMessage = ''
      
      if (isNaN(this.cubeSide) || this.cubeSide <= 0) {
        this.errorMessage = '边长必须是正数。'
        return false
      }
      
      if (this.cubes.length > 0) {
        // 如果场景中已有方块，则需要提示先重置
        this.errorMessage = '请先重置场景再更改边长。'
        return false
      }
      
      return true
    },
    
    resetScene() {
      // 禁用按钮防止重复点击
      this.loading = true
      this.activeAddition = null
      
      // 清除场景中的所有对象
      this.cubes.forEach(cube => {
        this.scene.remove(cube)
        if (cube.geometry) cube.geometry.dispose()
        if (cube.material) cube.material.dispose()
      })
      
      this.edgeLines.forEach(line => {
        this.scene.remove(line)
        if (line.geometry) line.geometry.dispose()
      })
      
      this.cubes = []
      this.edgeLines = []
      this.numJoinedFaces = 0
      
      // 验证输入
      if (!this.validateInput()) {
        this.loading = false
        return
      }
      
      // 创建初始方块
      const initialCube = this.createCubeMesh(new THREE.Vector3(0, 0, 0))
      this.scene.add(initialCube)
      this.cubes.push(initialCube)
      
      // 创建边线
      const initialLines = this.createEdgeLines(initialCube.geometry, initialCube.position, initialCube.quaternion)
      this.scene.add(initialLines)
      this.edgeLines.push(initialLines)
      
      // 调整相机
      this.updateCamera()
      
      this.loading = false
    },
    
    createCubeMesh(position) {
      // 创建方块几何体
      const cubeGeo = new THREE.BoxGeometry(this.cubeSide, this.cubeSide, this.cubeSide)
      const cubeMat = this.cubeMaterial.clone()
      const cube = new THREE.Mesh(cubeGeo, cubeMat)
      
      cube.position.copy(position)
      cube.userData.isCube = true
      cube.userData.center = position.clone()
      
      return cube
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
    
    checkPositionOccupied(targetPos, tolerance = 0.1) {
      // 检查目标位置是否已被占用
      for (const cube of this.cubes) {
        if (cube.position.distanceTo(targetPos) < tolerance) {
          return true
        }
      }
      return false
    },
    
    onPointerDown(event) {
      if (this.activeAddition) return
      
      const rect = this.scene.userData.domElement.getBoundingClientRect()
      this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      this.raycaster.setFromCamera(this.pointer, this.camera)
      const intersects = this.raycaster.intersectObjects(this.cubes)
      
      if (intersects.length > 0) {
        const intersect = intersects[0]
        const clickedCube = intersect.object
        const faceNormal = intersect.face.normal.clone()
        
        // 确定新方块的位置
        const targetPos = clickedCube.position.clone().addScaledVector(faceNormal, this.cubeSide)
        
        if (!this.checkPositionOccupied(targetPos, this.cubeSide * 0.5)) {
          // 从远处开始添加动画
          const startPos = targetPos.clone().addScaledVector(
            faceNormal, 
            this.cubeSide * this.addStartDistanceFactor
          )
          
          const newCubeMesh = this.createCubeMesh(startPos)
          this.startAddAnimation(newCubeMesh, startPos, targetPos)
        }
      }
    },
    
    startAddAnimation(cubeMesh, startPos, targetPos) {
      if (this.activeAddition) return
      
      this.scene.add(cubeMesh)
      this.isAnimating = true
      
      this.activeAddition = {
        mesh: cubeMesh,
        startPos: startPos.clone(),
        targetPos: targetPos.clone(),
        startTime: this.clock.getElapsedTime()
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
        
        // 更新状态
        this.cubes.push(finishedMesh)
        this.numJoinedFaces++
        
        // 更新相机
        this.updateCamera()
        
        // 重置动画状态
        this.activeAddition = null
        this.isAnimating = false
      }
    },
    
    updateCamera() {
      if (this.cubes.length === 0) {
        this.camera.position.set(5, 4, 7)
        this.controls.target.set(0, 0, 0)
        this.controls.update()
        return
      }
      
      // 创建包围盒
      const box = new THREE.Box3()
      this.cubes.forEach(cube => box.expandByObject(cube))
      
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
.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 0.9em;
  color: var(--secondary-color);
}

.input-group input[type="number"] {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1em;
  background-color: #e9ecef;
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--bg-white);
  box-shadow: 0 0 0 3px rgba(74, 108, 212, 0.25);
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
  font-size: 0.9em;
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