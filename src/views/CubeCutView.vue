<template>
  <TeachingLayout :loading="loading">
    <!-- 控制面板插槽 -->
    <template #control-panel>
      <h2 class="panel-title">控制操作区</h2>
      
      <div class="concept-card">
        <h3 class="concept-card-title">提示</h3>
        <p>点击【开始动画】按钮，观察正方体如何被切割成8个小正方体。</p>
      </div>
      
      <div class="input-group">
        <label for="cubeSize">正方体边长</label>
        <input 
          type="number" 
          id="cubeSize" 
          v-model.number="cubeSize" 
          min="1" 
          max="10" 
          step="0.5"
          @change="updateCubeSize"
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
      
      <button 
        class="action-button" 
        @click="startAnimation"
      >开始动画</button>
      
      <button 
        class="action-button" 
        style="background-color: var(--secondary-color); margin-top: 10px;" 
        @click="resetView"
      >重置视角</button>
      
      <div class="interaction-tip">
        <strong>互动提示：</strong>点击任意一个小方块可以高亮显示它，再次点击或点击背景取消高亮。
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
      <h2 class="panel-title">正方体切割与表面积</h2>
      
      <div class="concept-card">
        <h3 class="concept-card-title">核心概念</h3>
        <p>当我们将一个正方体切割成多个小正方体时，会产生新的表面积。切割次数越多，新增的表面积就越大。</p>
      </div>
      
      <h3 class="panel-subtitle">初始状态</h3>
      <p>一个边长为 <span>{{ cubeSize }}</span> 厘米的正方体木块。</p>
      <p>它有 6 个相同的面，每个面的面积是 <span>{{ initialFaceArea }}</span> 平方厘米。</p>
      <p>正方体的总表面积为 <span>{{ initialTotalArea }}</span> 平方厘米。</p>
      
      <h3 class="panel-subtitle">切割过程</h3>
      <p>要将这个正方体切割成 8 个相等的小正方体，需要沿着长、宽、高三个方向各切一刀，共 <strong>3</strong> 刀。</p>
      
      <h3 class="panel-subtitle">表面积变化原理</h3>
      <p>每切一刀会形成 <strong>2个</strong> 新的内部表面。</p>
      <p>每个新表面的面积等于切面的面积，即 <span>{{ cutFaceArea }}</span> 平方厘米。</p>
      <p>因此，每切一刀会增加 <span>{{ areaPerCut }}</span> 平方厘米的表面积。</p>
      
      <h3 class="panel-subtitle">计算结果</h3>
      <p>总切割次数：<strong>3</strong> 次</p>
      <p>总增加的表面积：3 × {{ areaPerCut }} = <span class="highlight">{{ totalIncreasedArea }}</span> 平方厘米</p>
      <p>切割后的总表面积：{{ initialTotalArea }} + {{ totalIncreasedArea }} = <span class="highlight">{{ finalTotalArea }}</span> 平方厘米</p>
      
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
  name: 'CubeCutView',
  components: {
    TeachingLayout,
    ThreeScene
  },
  data() {
    return {
      loading: true,
      cubeSize: 2,
      animationSpeed: 1,
      smallCubeSize: 1,
      gap: 0.15,
      
      // 场景对象
      scene: null,
      camera: null,
      controls: null,
      
      // 动画相关
      animating: false,
      clock: new THREE.Clock(),
      animationDuration: 1.5,
      
      // 立方体相关
      cubes: [],
      initialPositions: [],
      targetPositions: [],
      initialCameraPosition: null,
      selectedCube: null,
      originalOpacity: 1.0,
      weakenedOpacity: 0.15
    }
  },
  computed: {
    initialFaceArea() {
      return this.cubeSize * this.cubeSize
    },
    initialTotalArea() {
      return 6 * this.initialFaceArea
    },
    cutFaceArea() {
      return this.initialFaceArea
    },
    areaPerCut() {
      return 2 * this.cutFaceArea
    },
    totalIncreasedArea() {
      return 3 * this.areaPerCut
    },
    finalTotalArea() {
      return this.initialTotalArea + this.totalIncreasedArea
    }
  },
  methods: {
    onSceneReady(sceneObjects) {
      // 保存场景对象
      this.scene = sceneObjects.scene
      this.camera = sceneObjects.camera
      this.controls = sceneObjects.controls
      
      // 创建光照
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
      this.scene.add(ambientLight)
      
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight1.position.set(5, 10, 7)
      this.scene.add(directionalLight1)
      
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
      directionalLight2.position.set(-5, -5, -5)
      this.scene.add(directionalLight2)
      
      // 调整相机位置
      this.initialCameraPosition = new THREE.Vector3(
        this.cubeSize * 1.8,
        this.cubeSize * 1.6,
        this.cubeSize * 2.8
      )
      this.camera.position.copy(this.initialCameraPosition)
      
      // 调整控制器参数
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.05
      
      // 创建材质模板
      this.originalMaterialTemplate = new THREE.MeshStandardMaterial({
        color: 0x6495ED,
        roughness: 0.6,
        metalness: 0.1,
        transparent: true,
        opacity: this.originalOpacity
      })
      
      this.newMaterialTemplate = new THREE.MeshStandardMaterial({
        color: 0xFA8072,
        roughness: 0.6,
        metalness: 0.1,
        transparent: true,
        opacity: this.originalOpacity
      })
      
      // 创建立方体
      this.createCubes()
      
      // 添加点击事件
      this.$refs.threeScene.$el.addEventListener('click', this.onPointerClick)
      
      // 取消加载状态
      this.loading = false
    },
    
    createCubes() {
      // 清除已有立方体
      this.cubes.forEach(cube => this.scene.remove(cube))
      this.cubes = []
      this.targetPositions = []
      this.initialPositions = []
      
      // 计算小立方体尺寸
      this.smallCubeSize = this.cubeSize / 2
      this.gap = this.smallCubeSize * 0.15
      
      // 创建8个小立方体
      for (let x = 0; x < 2; x++) {
        for (let y = 0; y < 2; y++) {
          for (let z = 0; z < 2; z++) {
            // 初始位置
            const posX = (x === 0 ? -1 : 1) * this.smallCubeSize / 2
            const posY = (y === 0 ? -1 : 1) * this.smallCubeSize / 2
            const posZ = (z === 0 ? -1 : 1) * this.smallCubeSize / 2
            
            const initialPosition = new THREE.Vector3(posX, posY, posZ)
            this.initialPositions.push(initialPosition)
            
            // 目标位置（带间隙）
            const gapX = (x === 0 ? -1 : 1) * this.gap
            const gapY = (y === 0 ? -1 : 1) * this.gap
            const gapZ = (z === 0 ? -1 : 1) * this.gap
            
            const targetPosition = new THREE.Vector3(
              posX + gapX,
              posY + gapY,
              posZ + gapZ
            )
            this.targetPositions.push(targetPosition)
            
            // 创建几何体
            const geometry = new THREE.BoxGeometry(
              this.smallCubeSize,
              this.smallCubeSize,
              this.smallCubeSize
            )
            
            // 为每个面创建材质
            const materials = []
            
            // 右面 (+X)
            materials.push(x === 1 ? this.originalMaterialTemplate.clone() : this.newMaterialTemplate.clone())
            // 左面 (-X)
            materials.push(x === 0 ? this.originalMaterialTemplate.clone() : this.newMaterialTemplate.clone())
            // 上面 (+Y)
            materials.push(y === 1 ? this.originalMaterialTemplate.clone() : this.newMaterialTemplate.clone())
            // 下面 (-Y)
            materials.push(y === 0 ? this.originalMaterialTemplate.clone() : this.newMaterialTemplate.clone())
            // 前面 (+Z)
            materials.push(z === 1 ? this.originalMaterialTemplate.clone() : this.newMaterialTemplate.clone())
            // 后面 (-Z)
            materials.push(z === 0 ? this.originalMaterialTemplate.clone() : this.newMaterialTemplate.clone())
            
            // 创建立方体对象
            const cube = new THREE.Mesh(geometry, materials)
            cube.position.copy(initialPosition)
            cube.userData.index = this.cubes.length
            
            this.scene.add(cube)
            this.cubes.push(cube)
          }
        }
      }
    },
    
    onAnimationFrame() {
      if (this.animating) {
        const elapsed = this.clock.getElapsedTime()
        const duration = this.animationDuration / this.animationSpeed
        const t = Math.min(elapsed / duration, 1.0)
        
        // 使用缓动函数使动画更加自然
        const easedT = this.easeOutBack(t)
        
        // 更新立方体位置
        for (let i = 0; i < this.cubes.length; i++) {
          const initialPos = this.initialPositions[i]
          const targetPos = this.targetPositions[i]
          
          this.cubes[i].position.lerpVectors(initialPos, targetPos, easedT)
        }
        
        // 动画结束
        if (t >= 1.0) {
          this.animating = false
        }
      }
    },
    
    easeOutBack(t) {
      const c1 = 1.70158
      const c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    },
    
    startAnimation() {
      this.clock.start()
      this.animating = true
    },
    
    resetView() {
      // 重置相机位置
      this.camera.position.copy(this.initialCameraPosition)
      this.controls.target.set(0, 0, 0)
      
      // 重置立方体位置
      for (let i = 0; i < this.cubes.length; i++) {
        this.cubes[i].position.copy(this.initialPositions[i])
      }
      
      // 重置选中状态
      if (this.selectedCube) {
        this.selectedCube = null
        this.cubes.forEach(cube => {
          cube.material.forEach(mat => {
            mat.opacity = this.originalOpacity
          })
        })
      }
      
      // 停止动画
      this.animating = false
    },
    
    updateCubeSize() {
      // 重新创建立方体
      this.createCubes()
      
      // 重置视图
      this.resetView()
    },
    
    onPointerClick(event) {
      // 创建射线检测器
      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2()
      
      // 获取鼠标位置
      const rect = this.$refs.threeScene.$el.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      // 设置射线
      raycaster.setFromCamera(pointer, this.camera)
      
      // 检测射线与立方体相交
      const intersects = raycaster.intersectObjects(this.cubes)
      
      if (intersects.length > 0) {
        // 点击到了立方体
        const clickedCube = intersects[0].object
        
        if (this.selectedCube === clickedCube) {
          // 再次点击相同立方体，取消选中
          this.selectedCube = null
          
          // 重置透明度
          this.cubes.forEach(cube => {
            cube.material.forEach(mat => {
              mat.opacity = this.originalOpacity
            })
          })
        } else {
          // 选中不同立方体
          this.selectedCube = clickedCube
          
          // 调整透明度
          this.cubes.forEach(cube => {
            if (cube !== this.selectedCube) {
              cube.material.forEach(mat => {
                mat.opacity = this.weakenedOpacity
              })
            } else {
              cube.material.forEach(mat => {
                mat.opacity = this.originalOpacity
              })
            }
          })
        }
      } else {
        // 点击背景，取消选中
        if (this.selectedCube) {
          this.selectedCube = null
          
          // 重置透明度
          this.cubes.forEach(cube => {
            cube.material.forEach(mat => {
              mat.opacity = this.originalOpacity
            })
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.back-to-home {
  display: inline-block;
  margin-top: 15px;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
}

.back-to-home:hover {
  text-decoration: underline;
}

/* 表单元素样式 */
.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.input-group input[type="number"],
.input-group input[type="text"],
.input-group select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.95rem;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(74, 108, 212, 0.25);
}

/* 按钮样式 */
.action-button {
  display: block;
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background-color: var(--primary-color);
  color: var(--text-light);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: #3a5bc4;
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
</style> 