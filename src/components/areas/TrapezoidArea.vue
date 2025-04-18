<template>
  <div class="shape-area">
    <div class="concept-card">
      <h3 class="concept-card-title">梯形的认识</h3>
      <p>梯形是一种四边形，有如下特点：</p>
      <ul>
        <li>有且仅有一对平行边</li>
        <li>平行的两边称为上底和下底</li>
        <li>上底和下底之间的垂直距离称为高</li>
      </ul>
      <div class="illustration">
        <img src="@/assets/images/trapezoid-properties.svg" alt="梯形特性示意图" @error="$event.target.style.display='none'">
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">梯形面积计算公式</h3>
      <p>梯形的面积等于上底和下底的和乘以高，再除以2：</p>
      <div class="formula-container">
        <MathFormula formula="S = \frac{(a + c) \times h}{2}" display />
      </div>
      <p>其中：</p>
      <ul>
        <li><MathFormula formula="S" /> 表示面积</li>
        <li><MathFormula formula="a" /> 表示上底长度</li>
        <li><MathFormula formula="c" /> 表示下底长度</li>
        <li><MathFormula formula="h" /> 表示高（上底到下底的垂直距离）</li>
      </ul>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">梯形面积的理解</h3>
      <p>梯形的面积计算可以通过以下方式理解：</p>
      <ol>
        <li>将两个完全相同的梯形拼接在一起</li>
        <li>拼接时让一个梯形上下颠倒</li>
        <li>拼接后形成一个平行四边形</li>
        <li>这个平行四边形的底等于上底加下底，高等于梯形的高</li>
        <li>所以梯形的面积是这个平行四边形面积的一半</li>
      </ol>
      <p>这就是为什么梯形面积公式是 (上底+下底)×高÷2</p>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">当前梯形的面积计算</h3>
      <p>根据输入的数据：</p>
      <ul>
        <li>上底 = {{ shapeData.topBase }} 厘米</li>
        <li>下底 = {{ shapeData.bottomBase }} 厘米</li>
        <li>高 = {{ shapeData.height }} 厘米</li>
      </ul>
      <p>我们可以计算：</p>
      <div class="calculation">
        <p>面积 = ({{ shapeData.topBase }} + {{ shapeData.bottomBase }}) × {{ shapeData.height }} ÷ 2 = <strong>{{ area }}</strong> 平方厘米</p>
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">特殊的梯形</h3>
      <p>某些特殊的梯形包括：</p>
      <ul>
        <li><strong>等腰梯形</strong>：两条非平行边相等的梯形</li>
        <li><strong>直角梯形</strong>：有两个直角的梯形</li>
      </ul>
      <p>无论哪种梯形，面积计算公式都是一样的：(上底+下底)×高÷2</p>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">生活中的梯形</h3>
      <p>梯形在我们的日常生活中有许多例子：</p>
      <ul>
        <li>斜坡或坡道的侧视图</li>
        <li>梯形音箱</li>
        <li>某些建筑的立面</li>
        <li>衣服中的梯形裁片</li>
        <li>梯田</li>
      </ul>
      <p>了解梯形的面积计算，可以帮助我们解决与这些形状相关的实际问题，如计算需要多少材料来铺设一个梯形草坪，或者一个梯形屋顶需要多少瓦片等。</p>
    </div>
  </div>
</template>

<script>
import MathFormula from '../MathFormula.vue'

export default {
  name: 'TrapezoidArea',
  components: {
    MathFormula
  },
  inject: ['shapeData'],
  computed: {
    area() {
      const { topBase, bottomBase, height } = this.shapeData()
      return ((topBase + bottomBase) * height / 2).toFixed(2)
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