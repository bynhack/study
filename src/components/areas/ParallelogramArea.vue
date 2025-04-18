<template>
  <div class="shape-area">
    <div class="concept-card">
      <h3 class="concept-card-title">平行四边形的认识</h3>
      <p>平行四边形是一种四边形，它的对边平行且相等。平行四边形有如下特点：</p>
      <ul>
        <li>对边平行且相等</li>
        <li>对角相等</li>
        <li>对角线互相平分</li>
        <li>任意一组对边的距离称为高</li>
      </ul>
      <div class="illustration">
        <img src="@/assets/images/parallelogram-properties.svg" alt="平行四边形特性示意图" @error="$event.target.style.display='none'">
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">平行四边形面积计算公式</h3>
      <p>平行四边形的面积计算公式：</p>
      <div class="formula-container">
        <MathFormula formula="S = a \times h" display />
      </div>
      <p>其中：</p>
      <ul>
        <li><MathFormula formula="S" /> 表示面积</li>
        <li><MathFormula formula="a" /> 表示底边长度</li>
        <li><MathFormula formula="h" /> 表示高（与底边垂直的距离）</li>
      </ul>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">平行四边形面积的理解</h3>
      <p>平行四边形的面积计算可以通过转化为长方形来理解：</p>
      <ol>
        <li>从平行四边形的一侧剪下一个三角形</li>
        <li>将这个三角形移动到另一侧</li>
        <li>这样平行四边形就变成了一个长方形</li>
        <li>这个长方形的长等于平行四边形的底边，宽等于平行四边形的高</li>
      </ol>
      <p>所以，平行四边形的面积公式与长方形的面积公式是相似的。</p>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">当前平行四边形的面积计算</h3>
      <p>根据输入的数据：</p>
      <ul>
        <li>底边长 = {{ shapeData.base }} 厘米</li>
        <li>高 = {{ shapeData.height }} 厘米</li>
      </ul>
      <p>我们可以计算：</p>
      <div class="calculation">
        <p>面积 = {{ shapeData.base }} × {{ shapeData.height }} = <strong>{{ area }}</strong> 平方厘米</p>
      </div>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">平行四边形与长方形的关系</h3>
      <p>长方形是一种特殊的平行四边形，它有以下额外特点：</p>
      <ul>
        <li>四个角都是直角（90°）</li>
        <li>对角线相等</li>
      </ul>
      <p>因此，长方形的面积公式（长×宽）其实就是平行四边形面积公式的特例。在平行四边形中，底和相应的高相当于长方形的长和宽。</p>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">特殊的平行四边形</h3>
      <p>某些特殊的平行四边形包括：</p>
      <ul>
        <li><strong>矩形</strong>：有四个直角的平行四边形</li>
        <li><strong>菱形</strong>：四条边都相等的平行四边形</li>
        <li><strong>正方形</strong>：既是矩形又是菱形的平行四边形</li>
      </ul>
      <p>所有这些特殊形状都遵循相同的面积计算公式：底边×高</p>
    </div>
    
    <div class="concept-card">
      <h3 class="concept-card-title">生活中的平行四边形</h3>
      <p>平行四边形在我们的日常生活中有很多应用，例如：</p>
      <ul>
        <li>一些建筑物外观设计</li>
        <li>交通标志</li>
        <li>家具设计（如菱形桌子）</li>
        <li>折叠梯子的结构</li>
        <li>一些书籍和杂志的设计</li>
      </ul>
      <p>了解平行四边形的面积计算，可以帮助我们在设计和装饰中更好地规划空间。</p>
    </div>
  </div>
</template>

<script>
import MathFormula from '../MathFormula.vue'

export default {
  name: 'ParallelogramArea',
  components: {
    MathFormula
  },
  inject: ['shapeData'],
  computed: {
    area() {
      const { base, height } = this.shapeData()
      return (base * height).toFixed(2)
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