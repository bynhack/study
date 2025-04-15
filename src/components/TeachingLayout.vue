<template>
  <div class="teaching-layout">
    <!-- 控制面板 -->
    <aside class="control-panel">
      <slot name="control-panel"></slot>
    </aside>
    
    <!-- 内容展示区域 -->
    <main class="content-area">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>
      <slot name="content-area"></slot>
    </main>
    
    <!-- 知识概念区域 -->
    <aside class="concept-panel">
      <slot name="concept-panel"></slot>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'TeachingLayout',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.teaching-layout {
  display: grid;
  grid-template-columns: var(--control-panel-width) 1fr var(--concept-panel-width);
  grid-template-areas: "controls content concept";
  height: 100vh;
  overflow: hidden;
}

.control-panel {
  grid-area: controls;
  background-color: var(--bg-white);
  padding: var(--panel-padding);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.content-area {
  grid-area: content;
  position: relative;
  overflow: hidden;
}

.concept-panel {
  grid-area: concept;
  background-color: var(--bg-white);
  padding: var(--panel-padding);
  border-left: 1px solid var(--border-color);
  overflow-y: auto;
  z-index: 10;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .teaching-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas: 
      "controls"
      "content" 
      "concept";
    overflow-y: auto;
    height: auto;
  }
  
  .control-panel, 
  .concept-panel {
    max-height: 40vh;
    border: none;
    box-shadow: var(--shadow-sm);
    margin: var(--panel-spacing);
    border-radius: var(--border-radius);
  }
  
  .content-area {
    height: 60vh;
    margin: 0 var(--panel-spacing);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
    background-color: var(--bg-white);
  }
}

/* 平板响应式 */
@media (min-width: 768px) and (max-width: 1024px) {
  .teaching-layout {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas: 
      "content content" 
      "controls concept";
  }
}
</style> 