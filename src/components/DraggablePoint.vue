<template>
  <div class="draggable-point"></div>
</template>

<script>
export default {
  name: 'DraggablePoint',
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    radius: {
      type: Number,
      default: 8
    },
    color: {
      type: String,
      default: '#3498db'
    },
    isActive: {
      type: Boolean,
      default: false
    },
    twoObj: {
      type: Object,
      required: true
    },
    constraint: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      point: null,
      isDragging: false,
      offsetX: 0,
      offsetY: 0
    }
  },
  watch: {
    x(newVal) {
      if (this.point && !this.isDragging) {
        this.point.translation.x = newVal
        this.twoObj.update()
      }
    },
    y(newVal) {
      if (this.point && !this.isDragging) {
        this.point.translation.y = newVal
        this.twoObj.update()
      }
    },
    isActive(newVal) {
      if (this.point) {
        this.point.fill = newVal ? '#ff6b6b' : this.color
        this.twoObj.update()
      }
    }
  },
  mounted() {
    this.createPoint()
    this.addEventListeners()
  },
  beforeUnmount() {
    this.removeEventListeners()
    if (this.point && this.twoObj) {
      this.twoObj.remove(this.point)
      this.twoObj.update()
    }
  },
  methods: {
    createPoint() {
      this.point = this.twoObj.makeCircle(this.x, this.y, this.radius)
      this.point.fill = this.isActive ? '#ff6b6b' : this.color
      this.point.stroke = '#2c3e50'
      this.point.linewidth = 1
      this.twoObj.update()

      // 将点转换为可交互元素
      this.point._renderer.elem.style.cursor = 'pointer'
      this.point._renderer.elem.setAttribute('data-draggable', 'true')
    },
    addEventListeners() {
      if (this.point && this.point._renderer && this.point._renderer.elem) {
        this.point._renderer.elem.addEventListener('mousedown', this.onMouseDown)
        this.point._renderer.elem.addEventListener('touchstart', this.onTouchStart, { passive: false })
      }
    },
    removeEventListeners() {
      if (this.point && this.point._renderer && this.point._renderer.elem) {
        this.point._renderer.elem.removeEventListener('mousedown', this.onMouseDown)
        this.point._renderer.elem.removeEventListener('touchstart', this.onTouchStart)
      }
      window.removeEventListener('mousemove', this.onMouseMove)
      window.removeEventListener('mouseup', this.onMouseUp)
      window.removeEventListener('touchmove', this.onTouchMove)
      window.removeEventListener('touchend', this.onTouchEnd)
    },
    onMouseDown(event) {
      event.preventDefault()
      this.startDrag(event.clientX, event.clientY)
      window.addEventListener('mousemove', this.onMouseMove)
      window.addEventListener('mouseup', this.onMouseUp)
    },
    onMouseMove(event) {
      if (this.isDragging) {
        this.updateDrag(event.clientX, event.clientY)
      }
    },
    onMouseUp() {
      this.endDrag()
      window.removeEventListener('mousemove', this.onMouseMove)
      window.removeEventListener('mouseup', this.onMouseUp)
    },
    onTouchStart(event) {
      event.preventDefault()
      if (event.touches.length === 1) {
        const touch = event.touches[0]
        this.startDrag(touch.clientX, touch.clientY)
        window.addEventListener('touchmove', this.onTouchMove, { passive: false })
        window.addEventListener('touchend', this.onTouchEnd)
      }
    },
    onTouchMove(event) {
      if (this.isDragging && event.touches.length === 1) {
        event.preventDefault()
        const touch = event.touches[0]
        this.updateDrag(touch.clientX, touch.clientY)
      }
    },
    onTouchEnd() {
      this.endDrag()
      window.removeEventListener('touchmove', this.onTouchMove)
      window.removeEventListener('touchend', this.onTouchEnd)
    },
    startDrag(clientX, clientY) {
      this.isDragging = true
      const rect = this.point._renderer.elem.getBoundingClientRect()
      this.offsetX = clientX - rect.left - this.radius
      this.offsetY = clientY - rect.top - this.radius
      this.$emit('dragStart', { x: this.point.translation.x, y: this.point.translation.y })
    },
    updateDrag(clientX, clientY) {
      if (!this.isDragging) return

      const svgElem = this.twoObj.renderer.domElement
      const svgRect = svgElem.getBoundingClientRect()
      
      // 计算SVG坐标系中的位置
      let x = clientX - svgRect.left - this.offsetX
      let y = clientY - svgRect.top - this.offsetY
      
      // 应用约束条件（如果有）
      if (this.constraint) {
        const constrained = this.constraint({ x, y })
        x = constrained.x
        y = constrained.y
      }
      
      // 更新点的位置
      this.point.translation.x = x
      this.point.translation.y = y
      this.twoObj.update()
      
      // 通知父组件位置已更改
      this.$emit('positionChange', { x, y })
    },
    endDrag() {
      if (this.isDragging) {
        this.isDragging = false
        this.$emit('dragEnd', { 
          x: this.point.translation.x, 
          y: this.point.translation.y 
        })
      }
    }
  }
}
</script>

<style scoped>
.draggable-point {
  position: absolute;
  pointer-events: none;
}
</style> 