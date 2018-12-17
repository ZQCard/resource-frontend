<template>
    <div class="statistics">
          <Row>
            <Col span="6">
                <Card>
                    <p slot="title">总收入</p>
                    <h1>{{income}}</h1>
                </Card>
            </Col>
            <Col span="6" offset="2">
                <Card dis-hover>
                    <p slot="title">总支出</p>
                    <h1>{{expand}}</h1>
                </Card>
            </Col>
            <Col span="6" offset="2">
                <Card dis-hover>
                    <p slot="title">理论存款</p>
                    <h1>{{income - expand}}</h1>
                </Card>
            </Col>
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
        incomeOfYear: [],
        expandOfYear: []
      },
      expand: 0,
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
      this.expand = res.data.summary[0]
      this.income = res.data.summary[1]
      for (let i in res.data.year_expand) {
        this.chartData.expandOfYear.push(res.data.year_expand[i])
      }
      for (let i in res.data.year_income) {
        this.chartData.incomeOfYear.push(res.data.year_income[i])
      }
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
