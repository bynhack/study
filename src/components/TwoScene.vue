<template>
  <div class="two-container" ref="twoContainer"></div>
</template>

<script>
import Two from 'two.js'
import { markRaw } from 'vue'

export default {
  name: 'TwoScene',
  emits: ['sceneReady', 'animationFrame'],
  data() {
    return {
      two: null,
      width: 0,
      height: 0,
      isReady: false
    }
  },
  mounted() {
    this.initTwoJS()
    window.addEventListener('resize', this.onResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
    if (this.two) {
      this.two.unbind('update')
      this.two.pause()
    }
  },
  methods: {
    initTwoJS() {
      const container = this.$refs.twoContainer
      this.width = container.clientWidth
      this.height = container.clientHeight

      this.two = markRaw(new Two({
        type: Two.Types.svg,
        width: this.width,
        height: this.height,
        autostart: true
      }).appendTo(container))

      // 设置场景
      this.two.bind('update', this.onAnimationFrame)
      
      // 通知父组件场景已准备好
      this.$nextTick(() => {
        this.isReady = true
        this.$emit('sceneReady', {
          two: this.two,
          container: container
        })
      })
    },
    onAnimationFrame() {
      if (this.isReady) {
        this.$emit('animationFrame')
      }
    },
    onResize() {
      if (this.two) {
        this.width = this.$refs.twoContainer.clientWidth
        this.height = this.$refs.twoContainer.clientHeight
        this.two.width = this.width
        this.two.height = this.height
        this.two.update()
      }
    }
  }
}
</script>

<style scoped>
.two-container {
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
  overflow: hidden;
}
</style> 