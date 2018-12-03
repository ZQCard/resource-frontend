<template>
    <div class="bill">
      <div style="background:#eee;padding: 20px">
        <Card>
            <Button type="primary" style="margin: 20px;" @click="addBill">添加账单</Button>
            <Button type="error" style="margin: 20px;" @click="addBill">查看统计图</Button>
        </Card>
      </div>
      <Table :columns="columns1" :data="bill_data"></Table>
      <Page :page-size-opts="pagesizeopts" :page-size="pageSize" :total="totalCount" :current="page" @on-change="getPage" @on-page-size-change="Pages" class="page-nav" show-sizer show-elevator show-total></Page>
      <!--添加模态框-->
      <Modal
        v-model="formShow"
        :title="formTitle"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form :model="form" :label-width="80">
          <input type="hidden" name="id" v-model="form.id"/>
          <FormItem label="类型">
              <Select v-model="form.type" placeholder="选择金额类型">
                <Option value="0">支出</Option>
                <Option value="1">收入</Option>
              </Select>
          </FormItem>
          <FormItem label="分类">
              <Input type="text" v-model="form.category"/>
          </FormItem>
          <FormItem label="金额">
              <Input type="text" v-model="form.money"/>
          </FormItem>
          <FormItem label="日期">
              <DatePicker type="date" v-model="form.date" placement="bottom-end" placeholder="选择日期"></DatePicker>
          </FormItem>
      </Form>
      </Modal>
      <Spin size="large" fix v-if="spinShow"/>
    </div>
</template>
<script>
import {getDataList, postDataForm, getDataView, putDataForm, deleteData} from '@/api/data'
export default {
  data () {
    return {
      spinShow: true,
      // 分页数据
      totalCount: 0,
      pageSize: 10,
      page: 1,
      pagesizeopts: [5, 10, 15],

      // 模态框
      formShow: false,

      // 数据表单
      formTitle: '',
      form: {
        id: '',
        type: '',
        money: '',
        date: '',
        category: ''
      },
      // 表格列
      columns1: [
        {
          title: 'Id',
          key: 'id',
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          align: 'center'
        },
        {
          title: '分类',
          key: 'category',
          align: 'center'
        },
        {
          title: '金额',
          key: 'money',
          align: 'center'
        },
        {
          title: '时间',
          key: 'date',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 125,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.viewInfo(params.row)
                  }
                }
              }, '编辑'),
              h('Poptip', {
                props: {
                  confirm: true,
                  title: '确定要删除吗?',
                  type: 'error',
                  size: 'small',
                  transfer: true
                },
                on: {
                  'on-ok': () => {
                    this.Delete(params.row)
                  },
                  'on-cancel': () => {
                    this.$Message.info('点击了取消')
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  }
                }, '删除')
              ])
            ])
          }
        }
      ],
      bill_data: [
      ]
    }
  },
  created () {
    this.getInitData()
  },
  methods: {
    getInitData () {
      this.spinShow = true
      let params = new URLSearchParams()
      params.append('page', this.page)
      params.append('pageSize', this.pageSize)
      getDataList('personal/bills', params).then(res => {
        // 数据处理
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].type === 0) {
            res.data.list[i].type = '支出'
          } else {
            res.data.list[i].type = '收入'
          }
          res.data.list[i].date = res.data.list[i].year + '-' + res.data.list[i].month + '-' + res.data.list[i].day
        }
        this.bill_data = res.data.list
        this.totalCount = res.data.totalCount
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
      this.spinShow = false
    },
    // 根据页码查看信息
    getPage (page) {
      this.page = page
      this.getInitData()
    },
    Pages (pageSize) {
      this.pageSize = pageSize
      this.getInitData()
    },
    addBill () {
      this.formShow = true
      this.formTitle = '添加账单'
      this.form.type = ''
      this.form.money = ''
      this.form.category = ''
      this.form.date = ''
    },
    ok () {
      let params = new URLSearchParams()
      params.append('category', this.form.category)
      params.append('money', this.form.money)
      let date = new Date(this.form.date)
      params.append('date', date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
      params.append('type', this.form.type)
      if (this.form.id === '') { // 添加
        postDataForm('personal/bill', params).then(res => {
          this.$Message.success({
            content: res.data.message,
            duration: 3,
            onClose: function () {
              window.location.reload()
            }
          })
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
      } else { // 编辑
        params.append('id', this.form.id)
        putDataForm('personal/bill', params).then(res => {
          this.$Message.success({
            content: res.data.message,
            duration: 3,
            onClose: function () {
              window.location.reload()
            }
          })
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
    },
    cancel () {
      this.$Message.info('已取消')
    },
    viewInfo (row) {
      // 请求查看详情
      this.formTitle = '编辑账单'
      let params = new URLSearchParams()
      params.append('id', row.id)
      getDataView('personal/bill', params).then(res => {
        this.form.id = res.data.info.id
        this.form.type = res.data.info.type
        this.form.category = res.data.info.category
        this.form.money = res.data.info.money
        this.form.date = res.data.info.year + '-' + res.data.info.month + '-' + res.data.info.day
        console.log(this.form.type)
        this.formShow = true
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
    Delete (row) {
      // 删除记录
      let params = new URLSearchParams()
      params.append('id', row.id)
      deleteData('personal/bill', params).then(res => {
        this.$Message.success({
          content: res.data.message,
          duration: 3,
          onClose: function () {
            window.location.reload()
          }
        })
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
}
</script>
