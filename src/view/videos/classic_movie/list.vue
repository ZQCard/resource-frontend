<template>
    <div class="classic_moive">
      <div style="background:#eee;padding: 20px">
        <Card>
            <Button type="primary" style="margin-bottom: 20px;" @click="addMovie">添加电影</Button>
        </Card>
      </div>
      <Table :columns="columns1" :data="video_data"></Table>
      <Page :page-size-opts="pagesizeopts" :page-size="pageSize" :total="totalCount" :current="page" @on-change="getPage" @on-page-size-change="Pages" class="page-nav" show-sizer show-elevator show-total></Page>
      <!--添加模态框-->
      <Modal
        v-model="addShow"
        title="添加经典电影"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form :model="form" :label-width="80">
          <FormItem label="名称">
              <Input type="text" v-model="form.name"/>
          </FormItem>
          <FormItem label="链接地址">
              <Input type="text" v-model="form.href"/>
          </FormItem>
      </Form>
      </Modal>
    </div>
</template>
<script>
import {getVideosList, postDataForm} from '@/api/data'
import {getNormalTime} from '@/libs/tools'
export default {
  data () {
    return {
      // 分页数据
      totalCount: 0,
      pageSize: 10,
      page: 1,
      pagesizeopts: [5, 10, 15],

      // 模态框
      addShow: false,

      // 数据表单
      form: {
        name: '',
        href: ''
      },
      // 表格列
      columns1: [
        {
          title: 'Id',
          key: 'id'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '链接地址',
          key: 'href'
        },
        {
          title: '创建时间',
          key: 'created_at'
        }
      ],
      video_data: [
      ]
    }
  },
  created () {
    this.getInitData()
  },
  methods: {
    getInitData () {
      let page = this.page
      let pageSize = this.pageSize
      getVideosList('classic', page, pageSize).then(res => {
        // 数据处理
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].created_at = getNormalTime(res.data.list[i].created_at)
        }

        this.video_data = res.data.list
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
    addMovie () {
      this.addShow = true
    },
    ok () {
      let params = new URLSearchParams()
      params.append('name', this.form.name)
      params.append('href', this.form.href)
      params.append('type', 'classic')
      postDataForm('video', params).then(res => {
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
    cancel () {
      this.$Message.info('已取消')
    }
  }
}
</script>
