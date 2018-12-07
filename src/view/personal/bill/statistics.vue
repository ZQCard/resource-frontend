<template>
    <div class="statistics">
        <Row :gutter="20">
            <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
                <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
                <count-to :end="infor.count" count-class="count-style"/>
                <p>{{ infor.title }}</p>
                </infor-card>
            </i-col>
        </Row>

        <div>
            <h1>支出统计</h1>
            <Row :gutter="20" style="margin-top: 10px;">
                <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
                    <Card shadow>
                        <chart-pie style="height: 300px;" :value="summaryForm.expand_all" text="全部"></chart-pie>
                    </Card>
                </i-col>
                <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
                    <Card shadow>
                        <chart-pie style="height: 300px;" :value="summaryForm.expand_year" text="今年"></chart-pie>
                    </Card>
                </i-col>
                <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
                    <Card shadow>
                        <chart-pie style="height: 300px;" :value="summaryForm.expand_month" text="此月"></chart-pie>
                    </Card>
                </i-col>
            </Row>
        </div>

        <div>
            <h1>收入统计</h1>
            <Row :gutter="20" style="margin-top: 10px;">
                <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
                    <Card shadow>
                        <chart-pie style="height: 300px;" :value="summaryForm.income_all" text="全部"></chart-pie>
                    </Card>
                </i-col>
                <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
                    <Card shadow>
                        <chart-pie style="height: 300px;" :value="summaryForm.income_year" text="今年"></chart-pie>
                    </Card>
                </i-col>
                <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
                    <Card shadow>
                        <chart-pie style="height: 300px;" :value="summaryForm.income_month" text="此月"></chart-pie>
                    </Card>
                </i-col>
            </Row>
        </div>
        <div id="echartContainer" ref="echartContainer" style="width:90%; height:500px"></div>
        <Spin size="large" fix v-if="spinShow"/>
    </div>
</template>
<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import {getDataView} from '@/api/data'
import { ChartPie } from '_c/charts'
import echarts from 'echarts'
export default {
  name: 'statistics',
  components: {
    CountTo,
    InforCard,
    ChartPie
  },

  data () {
    return {
      myChart: '',
      spinShow: false,
      currentYear: 2018,
      chartData: {
        incomeOfYear: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11, 12],
        expandOfYear: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11, 12]
      },
      expand: 10,
      income: 0,
      summaryForm: {
        expand_all: [
        ],
        expand_year: [
        ],
        expand_month: [
        ],
        income_all: [
        ],
        income_year: [
        ],
        income_month: [
        ]
      }
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler: function (val) {
        this.createChart(val)
      }
    }
  },
  created () {
    let params = new URLSearchParams()
    getDataView('personal/bill/summary', params).then(res => {
      this.summaryForm.expand_all = res.data.expand_all
      this.summaryForm.expand_year = res.data.expand_year
      this.summaryForm.expand_month = res.data.expand_month

      this.summaryForm.income_all = res.data.income_all
      this.summaryForm.income_year = res.data.income_year
      this.summaryForm.income_month = res.data.income_month

      for (var i in res.data.summary) {
        if (i === 0) {
          this.expand = res.data.summary[i]
        } else {
          this.income = res.data.summary[i]
        }
      }
      Array.prototype.push.apply(this.chartData.expandOfYear, res.data.year_expand)
      Array.prototype.push.apply(this.chartData.incomeOfYear, res.data.year_income)
    }).catch(err => {
      // 错误处理
      if (err.response.data.message) {
        this.$Message.error({
          content: err.response.data.message,
          duration: 3
        })
      } else {
        this.$Message.error({
          content: err.response.data,
          duration: 3
        })
      }
    })
  },
  computed: {
    inforCardData () {
      return [
        { title: '总收入', icon: 'md-add', count: this.income, color: '#2d8cf0' },
        { title: '总支出', icon: 'md-cart', count: this.expand, color: '#19be6b' },
        { title: '理论存额', icon: 'md-book', count: this.income - this.expand, color: '#ff9900' },
        { title: '实际存额', icon: 'md-briefcase', count: 0, color: '#ed3f14' }
      ]
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    createChart (params) {
      let options = {
        title: {
          text: '收支统计表',
          subtext: 2018
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
            data: params.incomeOfYear,
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
            data: params.expandOfYear,
            markPoint: {
              data: [
                {name: '月最低', value: -2, xAxis: 1, yAxis: -1.5}
              ]
            },
            markLine: {
              data: [
                {type: 'average', name: '平均值'}
              ]
            }
          }
        ]
      }
      this.myChart.setOption(options)
    },
    initChart () {
      this.myChart = echarts.init(this.$refs['echartContainer'])
      this.createChart(this.chartData)
    }
  }
}
</script>
<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
