<template>
  <div class="shape-area">
    <div class="concept-card">
      <h3 class="concept-card-title">长方形的认识</h3>
      <p>长方形是一种特殊的四边形，它有如下特点：</p>
      <ul>
        <li>四个角都是直角（90°）</li>
        <li>对边平行且相等</li>
        <li>对角线相等且互相平分</li>
      </ul>
      <div class="illustration">
        <img src="@/assets/images/rectangle-properties.svg" alt="长方形特性示意图" @error="$event.target.style.display='none'">
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">长方形面积计算公式</h3>
      <p>长方形的面积计算公式：</p>
      <div class="formula-container">
        <MathFormula formula="S = l \times w" display />
      </div>
      <p>其中：</p>
      <ul>
        <li><MathFormula formula="S" /> 表示面积</li>
        <li><MathFormula formula="l" /> 表示长度</li>
        <li><MathFormula formula="w" /> 表示宽度</li>
      </ul>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">当前长方形的面积计算</h3>
      <p>根据输入的数据：</p>
      <ul>
        <li>长 = {{ shapeData().length }} 厘米</li>
        <li>宽 = {{ shapeData().width }} 厘米</li>
      </ul>
      <p>我们可以计算：</p>
      <div class="calculation">
        <p>面积 = {{ shapeData().length }} × {{ shapeData().width }} = <strong>{{ area }}</strong> 平方厘米</p>
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">长方形的周长</h3>
      <p>长方形的周长计算公式：</p>
      <div class="formula-container">
        <MathFormula formula="P = 2(l + w)" display />
      </div>
      <p>当前长方形的周长：</p>
      <div class="calculation">
        <p>周长 = 2 × ({{ shapeData().length }} + {{ shapeData().width }}) = <strong>{{ perimeter }}</strong> 厘米</p>
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">生活中的长方形</h3>
      <p>长方形在我们的日常生活中随处可见：</p>
      <ul>
        <li>书本、纸张</li>
        <li>电脑屏幕、手机屏幕</li>
        <li>桌面、门窗</li>
        <li>各种标准尺寸的卡片（身份证、银行卡等）</li>
        <li>运动场地（足球场、篮球场等）</li>
      </ul>
      <p>了解长方形的面积计算，可以帮助我们在日常生活中解决各种实际问题，如计算铺地板所需材料、粉刷墙壁所需油漆等。</p>
    </div>
  </div>
</template>

<script>
import MathFormula from '../MathFormula.vue'

export default {
  name: 'RectangleArea',
  components: {
    MathFormula
  },
  inject: ['shapeData'],
  computed: {
    area() {
      const { length, width } = this.shapeData()
      return (length * width).toFixed(2)
    },
    perimeter() {
      const { length, width } = this.shapeData()
      return (2 * (length + width)).toFixed(2)
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