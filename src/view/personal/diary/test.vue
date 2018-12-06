<template>
    <div>
        <div id="echartContainer" style="width:800px; height:500px"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'test',
  data () {
    return {

    }
  },
  mounted () {
    let myChart = echarts.init(document.getElementById('echartContainer'))
    myChart.setOption({
      title: {
        text: '收支统计表',
        subtext: '2018'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['最高收入', '最高支出']
      },
      toolbox: {
        show: true,
        feature: {
          mark: {show: true},
          magicType: {show: true, type: ['line', 'bar']},
          saveAsImage: {show: true}
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          name: '月份'
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value} 元'
          }
        }
      ],
      series: [
        {
          name: '最高收入',
          type: 'line',
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          markPoint: {
            data: [
              {type: 'max', name: '最大值'},
              {type: 'min', name: '最小值'}
            ]
          },
          markLine: {
            data: [
              {type: 'average', name: '平均值'}
            ]
          }
        },
        {
          name: '最高支出',
          type: 'line',
          data: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
          markPoint: {
            data: [
              {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
            ]
          },
          markLine: {
            data: [
              {type: 'average', name: '平均值'}
            ]
          }
        }
      ]
    })
  }
}
</script>
