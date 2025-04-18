<template>
  <div class="math-formula" ref="formulaContainer"></div>
</template>

<script>
import katex from 'katex'
import 'katex/dist/katex.min.css'

export default {
  name: 'MathFormula',
  props: {
    formula: {
      type: String,
      required: true
    },
    display: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: String,
      default: '1rem'
    }
  },
  watch: {
    formula: {
      immediate: true,
      handler() {
        this.$nextTick(this.renderFormula)
      }
    },
    display: {
      handler() {
        this.$nextTick(this.renderFormula)
      }
    }
  },
  mounted() {
    this.renderFormula()
  },
  methods: {
    renderFormula() {
      const container = this.$refs.formulaContainer
      if (!container) return

      try {
        katex.render(this.formula, container, {
          displayMode: this.display,
          throwOnError: false,
          output: 'html'
        })
        container.style.fontSize = this.fontSize
      } catch (error) {
        console.error('KaTeX 渲染错误:', error)
        container.textContent = this.formula
      }
    }
  }
}
</script>

<style scoped>
.math-formula {
  display: inline-block;
  margin: 0.2rem 0;
}

.math-formula:deep(.katex) {
  /* 可以在此添加自定义的 KaTeX 样式 */
  font-family: 'KaTeX_Math', 'Times New Roman', serif;
}
</style> 