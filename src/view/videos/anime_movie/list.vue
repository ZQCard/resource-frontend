<template>
    <div class="anime_moive">
    <Table :columns="columns1" :data="video_data"></Table>
    <Page :page-size-opts="pagesizeopts" :page-size="pageSize" :total="totalCount" :current="page" @on-change="getPage" @on-page-size-change="Pages" class="page-nav" show-sizer show-elevator show-total></Page>
    </div>
</template>
<script>
import {getVideosList} from '@/api/data'
import {getNormalTime} from '@/libs/tools'
export default {
  data () {
    return {
      // 分页数据
      totalCount: 0,
      pageSize: 10,
      page: 1,
      pagesizeopts: [5, 10, 15],

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
      getVideosList('anime', page, pageSize).then(res => {
        // 数据处理
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].created_at = getNormalTime(res.data.list[i].created_at)
        }

        this.video_data = res.data.list
        this.totalCount = res.data.totalCount
      }).catch(err => {
        // 错误处理
        this.$Message.error(err.response.data.message)
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
    }
  }
}
</script>
