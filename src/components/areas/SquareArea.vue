<template>
  <div class="shape-area">
    <div class="concept-card">
      <h3 class="concept-card-title">正方形的认识</h3>
      <p>正方形是一种特殊的四边形，具有以下特点：</p>
      <ul>
        <li>四条边完全相等</li>
        <li>四个角都是直角（90°）</li>
        <li>对角线相等且互相垂直平分</li>
        <li>是特殊的长方形，也是特殊的菱形</li>
      </ul>
      <div class="illustration">
        <img src="@/assets/images/square-properties.svg" alt="正方形特性示意图" @error="$event.target.style.display='none'">
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">正方形面积计算公式</h3>
      <p>正方形的面积计算公式：</p>
      <div class="formula-container">
        <MathFormula formula="S = a^2" display />
      </div>
      <p>其中：</p>
      <ul>
        <li><MathFormula formula="S" /> 表示面积</li>
        <li><MathFormula formula="a" /> 表示边长</li>
      </ul>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">当前正方形的面积计算</h3>
      <p>根据输入的数据：</p>
      <ul>
        <li>边长 = {{ shapeData.side }} 厘米</li>
      </ul>
      <p>我们可以计算：</p>
      <div class="calculation">
        <p>面积 = {{ shapeData.side }} × {{ shapeData.side }} = <strong>{{ area }}</strong> 平方厘米</p>
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">正方形的周长</h3>
      <p>正方形的周长计算公式：</p>
      <div class="formula-container">
        <MathFormula formula="P = 4a" display />
      </div>
      <p>当前正方形的周长：</p>
      <div class="calculation">
        <p>周长 = 4 × {{ shapeData.side }} = <strong>{{ perimeter }}</strong> 厘米</p>
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">正方形的对角线</h3>
      <p>正方形的对角线计算公式：</p>
      <div class="formula-container">
        <MathFormula formula="d = a\sqrt{2}" display />
      </div>
      <p>当前正方形的对角线长度：</p>
      <div class="calculation">
        <p>对角线 = {{ shapeData.side }} × √2 ≈ <strong>{{ diagonal }}</strong> 厘米</p>
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">生活中的正方形</h3>
      <p>正方形在我们的日常生活中有多种应用：</p>
      <ul>
        <li>方形瓷砖</li>
        <li>正方形纸张（如便签纸）</li>
        <li>象棋棋盘格子</li>
        <li>某些窗户和相框</li>
        <li>正方形餐桌</li>
      </ul>
      <p>正方形是最基本、最规则的几何形状之一，在建筑、设计和艺术中都有广泛应用。</p>
    </div>
  </div>
</template>

<script>
import MathFormula from '../MathFormula.vue'

export default {
  name: 'SquareArea',
  components: {
    MathFormula
  },
  inject: ['shapeData'],
  computed: {
    area() {
      const side = this.shapeData().side
      return (side * side).toFixed(2)
    },
    perimeter() {
      const side = this.shapeData().side
      return (4 * side).toFixed(2)
    },
    diagonal() {
      const side = this.shapeData().side
      return (side * Math.sqrt(2)).toFixed(2)
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