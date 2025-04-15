<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'

// Props 定义
const props = defineProps({
  backgroundColor: {
    type: String,
    default: '#f8f9fa'
  }
})

// 事件定义
const emit = defineEmits(['sceneReady', 'animationFrame'])

// 使用 shallowRef 存储 Three.js 对象，避免深度响应式带来的问题
const scene = shallowRef(null)
const camera = shallowRef(null)
const renderer = shallowRef(null)
const controls = shallowRef(null)
const container = ref(null)
let animationId = null

// 初始化场景
const initScene = () => {
  if (!container.value) return
  
  // 初始化场景
  scene.value = new THREE.Scene()
  scene.value.background = new THREE.Color(props.backgroundColor)
  
  // 创建相机
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  camera.value = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
  camera.value.position.set(5, 5, 5)
  
  // 创建渲染器
  renderer.value = new THREE.WebGLRenderer({ antialias: true })
  renderer.value.setSize(width, height)
  renderer.value.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.value.domElement)
  
  // 创建控制器
  controls.value = new OrbitControls(camera.value, renderer.value.domElement)
  controls.value.enableDamping = true
  controls.value.dampingFactor = 0.05
  
  // 添加默认光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
  scene.value.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 7)
  scene.value.add(directionalLight)
  
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
  directionalLight2.position.set(-5, -5, -5)
  scene.value.add(directionalLight2)
  
  // 启动渲染循环
  animate()
  
  // 发出初始化完成事件
  emit('sceneReady', {
    scene: scene.value,
    camera: camera.value,
    renderer: renderer.value,
    controls: controls.value
  })
}

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  if (controls.value) {
    controls.value.update()
  }
  
  if (renderer.value && scene.value && camera.value) {
    renderer.value.render(scene.value, camera.value)
  }
  
  emit('animationFrame')
}

// 窗口大小变化处理
const onResize = () => {
  if (!camera.value || !renderer.value || !container.value) return
  
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  
  camera.value.aspect = width / height
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(width, height)
}

// 清理场景资源
const disposeScene = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  // 清除渲染器
  if (renderer.value) {
    renderer.value.dispose()
    if (container.value) {
      container.value.removeChild(renderer.value.domElement)
    }
  }
  
  // 清除控制器
  if (controls.value) {
    controls.value.dispose()
  }
  
  // 清除场景中的对象
  if (scene.value) {
    scene.value.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose()
      }
      
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
  }
}

// 监听背景色变化
watch(() => props.backgroundColor, (newColor) => {
  if (scene.value) {
    scene.value.background = new THREE.Color(newColor)
  }
})

// 生命周期钩子
onMounted(() => {
  initScene()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  disposeScene()
})
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
}
</style> 