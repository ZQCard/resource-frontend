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
        <Spin size="large" fix v-if="spinShow"/>
    </div>
</template>
<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import {getDataView} from '@/api/data'
import { ChartPie } from '_c/charts'
export default {
  name: 'statistics',
  components: {
    CountTo,
    InforCard,
    ChartPie
  },

  data () {
    return {
      spinShow: false,
      inforCardData: [
        { title: '总收入', icon: 'md-add', count: 1, color: '#2d8cf0' },
        { title: '总支出', icon: 'md-cart', count: 2, color: '#19be6b' },
        { title: '理论存额', icon: 'md-book', count: 1, color: '#ff9900' },
        { title: '实际存额', icon: 'md-briefcase', count: 0, color: '#ed3f14' }
      ],
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
  }
}
</script>
<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
