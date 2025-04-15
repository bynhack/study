<template>
  <div class="home">
    <header class="header">
      <h1 class="main-title">小学数学互动乐园</h1>
      <h2 class="sub-title">交互式数学知识点讲解与演示平台</h2>
    </header>
    
    <main>
      <!-- 数与运算类别 -->
      <section class="category-section">
        <h2 class="category-title">数与运算</h2>
        <div class="grid-container">
          <div class="grid-item">
            <h3 class="grid-item-title">整数四则运算</h3>
            <div class="grid-item-description">
              通过可视化方式理解加减乘除四则运算的基本原理，掌握运算法则与技巧。
            </div>
            <div>
              <span class="badge badge-grade">一年级</span>
              <span class="badge badge-interactive">互动演示</span>
            </div>
            <router-link to="/math-operations" class="entry-point">进入学习</router-link>
          </div>
          
          <div class="grid-item">
            <h3 class="grid-item-title">分数基础概念</h3>
            <div class="grid-item-description">
              通过可视化方式理解分数的基本概念，包括分数的表示、大小比较和基本运算。
            </div>
            <div>
              <span class="badge badge-grade">三年级</span>
              <span class="badge badge-interactive">互动演示</span>
            </div>
            <router-link to="/fractions" class="entry-point">进入学习</router-link>
          </div>
          
          <div class="grid-item">
            <h3 class="grid-item-title">小数加减法</h3>
            <div class="grid-item-description">
              探索小数的加减法运算，理解小数点对齐的重要性和运算规则。
            </div>
            <div>
              <span class="badge badge-grade">四年级</span>
              <span class="badge badge-new">新内容</span>
            </div>
            <router-link to="/decimals" class="entry-point">进入学习</router-link>
          </div>
        </div>
      </section>
      
      <!-- 几何与测量类别 -->
      <section class="category-section">
        <h2 class="category-title">几何与测量</h2>
        <div class="grid-container">
          <div class="grid-item">
            <h3 class="grid-item-title">正方体拼接演示</h3>
            <div class="grid-item-description">
              演示如何将多个正方体拼接在一起，并计算总表面积，支持点击高亮查看各个面。
            </div>
            <div>
              <span class="badge badge-grade">五年级</span>
              <span class="badge badge-interactive">互动演示</span>
            </div>
            <router-link to="/cube-join" class="entry-point">进入学习</router-link>
          </div>
          
          <div class="grid-item">
            <h3 class="grid-item-title">正方体切割演示</h3>
            <div class="grid-item-description">
              演示如何将一个正方体切割成8个小正方体，并计算表面积的变化，理解立体切割原理。
            </div>
            <div>
              <span class="badge badge-grade">五年级</span>
              <span class="badge badge-interactive">互动演示</span>
            </div>
            <router-link to="/cube-cut" class="entry-point">进入学习</router-link>
          </div>
          
          <div class="grid-item">
            <h3 class="grid-item-title">长方体切割演示</h3>
            <div class="grid-item-description">
              根据输入参数，演示长方体切割成多个小长方体的过程，计算并展示表面积变化。
            </div>
            <div>
              <span class="badge badge-grade">六年级</span>
              <span class="badge badge-interactive">互动演示</span>
            </div>
            <router-link to="/cuboid-cut" class="entry-point">进入学习</router-link>
          </div>
          
          <div class="grid-item">
            <h3 class="grid-item-title">长方体挖孔演示</h3>
            <div class="grid-item-description">
              演示长方体中间挖孔后的形状变化，计算剩余部分的表面积和体积，理解体积计算原理。
            </div>
            <div>
              <span class="badge badge-grade">六年级</span>
              <span class="badge badge-interactive">互动演示</span>
            </div>
            <router-link to="/cuboid-cut-cuboid" class="entry-point">进入学习</router-link>
          </div>
          
          <div class="grid-item">
            <h3 class="grid-item-title">长方体拼接演示</h3>
            <div class="grid-item-description">
              演示多个长方体拼接的过程，计算拼接后的总表面积，支持高亮显示不同部分。
            </div>
            <div>
              <span class="badge badge-grade">六年级</span>
              <span class="badge badge-interactive">互动演示</span>
            </div>
            <router-link to="/cuboid-join" class="entry-point">进入学习</router-link>
          </div>
          
          <div class="grid-item">
            <h3 class="grid-item-title">平面图形面积计算</h3>
            <div class="grid-item-description">
              通过可视化方式理解矩形、三角形、圆等基本平面图形的面积计算公式与应用。
            </div>
            <div>
              <span class="badge badge-grade">四年级</span>
              <span class="badge badge-new">新内容</span>
            </div>
            <router-link to="/areas" class="entry-point">进入学习</router-link>
          </div>
        </div>
      </section>
      
      <!-- 应用与实践类别 -->
      <section class="category-section">
        <h2 class="category-title">应用与实践</h2>
        <div class="grid-container">
          <div class="grid-item">
            <h3 class="grid-item-title">比例与比例尺</h3>
            <div class="grid-item-description">
              学习比例的概念和应用，特别是在地图比例尺中的实际应用，通过交互式演示掌握比例计算。
            </div>
            <div>
              <span class="badge badge-grade">五年级</span>
              <span class="badge badge-new">新内容</span>
            </div>
            <router-link to="/proportion" class="entry-point">进入学习</router-link>
          </div>
          
          <div class="grid-item">
            <h3 class="grid-item-title">数据统计与图表</h3>
            <div class="grid-item-description">
              学习如何收集、整理和分析数据，使用条形图、折线图等工具直观展示数据规律。
            </div>
            <div>
              <span class="badge badge-grade">四年级</span>
              <span class="badge badge-interactive">互动演示</span>
            </div>
            <router-link to="/statistics" class="entry-point">进入学习</router-link>
          </div>
          
          <div class="grid-item">
            <h3 class="grid-item-title">时间与日期计算</h3>
            <div class="grid-item-description">
              学习时间单位间的换算，以及日期、时间的加减计算，解决与时间相关的实际问题。
            </div>
            <div>
              <span class="badge badge-grade">三年级</span>
              <span class="badge badge-new">新内容</span>
            </div>
            <router-link to="/time" class="entry-point">进入学习</router-link>
          </div>
        </div>
      </section>
    </main>
    
    <footer>
      <p>小学数学互动乐园 © 2023 - 为小学数学教学提供交互式教具</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.main-title {
  color: var(--primary-color);
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.sub-title {
  color: var(--secondary-color);
  font-weight: 400;
  margin-top: 0;
}

.category-section {
  margin-bottom: 30px;
}

.category-title {
  color: var(--primary-color);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
  font-size: 1.5rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.grid-item {
  background-color: var(--bg-white);
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.grid-item-title {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.grid-item-description {
  margin-top: 10px;
  color: var(--text-dark);
  font-size: 0.95rem;
  line-height: 1.5;
  flex-grow: 1;
}

.entry-point {
  background-color: var(--primary-color);
  color: var(--text-light);
  padding: 12px 15px;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: var(--shadow-sm);
  font-weight: 600;
  display: block;
  text-align: center;
  margin-top: 15px;
}

.entry-point:hover {
  background-color: #3a5bc4;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 10px;
  margin-right: 5px;
}

.badge-grade {
  background-color: rgba(74, 108, 212, 0.1);
  color: var(--primary-color);
}

.badge-new {
  background-color: rgba(231, 76, 60, 0.1);
  color: var(--accent-color);
}

.badge-interactive {
  background-color: rgba(243, 156, 18, 0.1);
  color: var(--secondary-color);
}

footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  color: var(--secondary-color);
  font-size: 0.9rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
  
  .main-title {
    font-size: 2rem;
  }
}
</style> 