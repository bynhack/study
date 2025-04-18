<template>
  <div class="shape-area">
    <div class="concept-card">
      <h3 class="concept-card-title">圆形的认识</h3>
      <p>圆是平面上到定点（圆心）距离相等的所有点的集合。圆有如下特点：</p>
      <ul>
        <li>圆上任意一点到圆心的距离都相等，这个距离叫做半径</li>
        <li>圆的直径是穿过圆心的线段，长度是半径的两倍</li>
        <li>圆周长是圆的周长，等于直径乘以π（π约等于3.14159）</li>
      </ul>
      <div class="illustration">
        <img src="@/assets/images/circle-properties.svg" alt="圆形特性示意图" @error="$event.target.style.display='none'">
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">圆形面积计算公式</h3>
      <p>圆的面积计算公式：</p>
      <div class="formula-container">
        <MathFormula formula="S = \pi r^2" display />
      </div>
      <p>其中：</p>
      <ul>
        <li><MathFormula formula="S" /> 表示面积</li>
        <li><MathFormula formula="\pi" /> 是一个特殊的数，约等于 3.14159</li>
        <li><MathFormula formula="r" /> 表示圆的半径</li>
      </ul>
      <p>我们也可以用直径来表示圆的面积：</p>
      <div class="formula-container">
        <MathFormula formula="S = \frac{\pi d^2}{4}" display />
      </div>
      <p>其中 <MathFormula formula="d" /> 表示圆的直径，<MathFormula formula="d = 2r" /></p>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">当前圆形的面积计算</h3>
      <p>根据输入的数据：</p>
      <ul>
        <li>半径 = {{ shapeData.radius }} 厘米</li>
        <li>直径 = {{ diameter }} 厘米</li>
      </ul>
      <p>我们可以计算：</p>
      <div class="calculation">
        <p>面积 = π × {{ shapeData.radius }} × {{ shapeData.radius }} = <strong>{{ area }}</strong> 平方厘米</p>
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">圆周率π是什么</h3>
      <p>圆周率π是圆的周长与直径的比值，是一个无限不循环小数，约等于3.14159。</p>
      <p>在计算时，我们通常使用：</p>
      <ul>
        <li>精确计算：π ≈ 3.14159</li>
        <li>简化计算：π ≈ 3.14</li>
        <li>口算估算：π ≈ 3</li>
      </ul>
      <p>圆周率是数学中一个非常重要的常数，它在几何学、三角学等许多领域都有应用。</p>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">生活中的圆形</h3>
      <p>圆形在我们的日常生活中随处可见，例如：</p>
      <ul>
        <li>钟表的表盘</li>
        <li>自行车的车轮</li>
        <li>盘子和碗</li>
        <li>硬币</li>
        <li>太阳和月亮（从地球上看）</li>
      </ul>
      <p>了解圆的面积计算，可以帮助我们解决许多实际问题，比如计算一个圆形花坛需要多少种子，或者一个圆形披萨可以均分为多少块等。</p>
    </div>
  </div>
</template>

<script>
import MathFormula from '../MathFormula.vue'

export default {
  name: 'CircleArea',
  components: {
    MathFormula
  },
  inject: ['shapeData'],
  computed: {
    diameter() {
      return (this.shapeData().radius * 2).toFixed(2)
    },
    area() {
      const { radius } = this.shapeData()
      return (Math.PI * radius * radius).toFixed(2)
    }
  }
}
</script>

<style scoped>
.shape-area {
  padding: 10px 0;
}

.concept-card {
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}

.concept-card-title {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.formula-container {
  background-color: var(--bg-white);
  padding: 15px;
  border-radius: var(--border-radius-sm);
  margin: 15px 0;
  text-align: center;
}

.calculation {
  background-color: var(--bg-white);
  padding: 15px;
  border-radius: var(--border-radius-sm);
  margin: 15px 0;
}

.calculation strong {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.illustration {
  text-align: center;
  margin: 15px 0;
}

.illustration img {
  max-width: 100%;
  height: auto;
  border-radius: var(--border-radius-sm);
}
</style> 