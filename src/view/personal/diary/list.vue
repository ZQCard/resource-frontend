<template>
    <div class="diary">
      <div style="background:#eee;padding: 20px">
        <Card>
            <Button type="primary" style="margin: 20px;" @click="add_diary">添加文章</Button>
        </Card>
      </div>
      <Table :columns="columns1" :data="diary_data"></Table>
      <Page :page-size-opts="pagesizeopts" :page-size="pageSize" :total="totalCount" :current="page" @on-change="getPage" @on-page-size-change="Pages" class="page-nav" show-sizer show-elevator show-total></Page>
      <Spin size="large" fix v-if="spinShow"/>
      <Modal
        title="请输入密码"
        v-model="formShow"
        @on-ok="ok"
        >
              <Input v-model="secret" type="text" placeholder="请输入密码" />
    </Modal>
    </div>
</template>
<script>
import {getDataList, deleteData} from '@/api/data'
import {getNormalTime} from '@/libs/tools'
export default {
  data () {
    return {
      spinShow: true,
      secret: '',
      id: '',
      formShow: false,
      // 分页数据
      totalCount: 0,
      pageSize: 10,
      page: 1,
      pagesizeopts: [5, 10, 15],
      // 表格列
      columns1: [
        {
          title: 'Id',
          key: 'id',
          align: 'center'
        },
        {
          title: '标题',
          key: 'title',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'created_at',
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
      diary_data: [
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
      getDataList('personal/diaries', params).then(res => {
        // 数据处理
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].created_at = getNormalTime(res.data.list[i].created_at)
        }
        this.diary_data = res.data.list
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
    viewInfo (row) {
      this.formShow = true
      this.id = row.id
    },
    ok () {
      if (this.secret === '') {
        this.$Message.error({
          content: '密码不得为空',
          duration: 3
        })
        return
      }
      this.$router.push({name: 'create_diary', params: {id: this.id, secret: this.secret}})
    },
    Delete (row) {
      // 删除记录
      let params = new URLSearchParams()
      params.append('id', row.id)
      deleteData('personal/diary', params).then(res => {
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
    },
    add_diary () {
      this.$router.push({path: '/personal/diary/create'})
    }
  }
}
</script>
