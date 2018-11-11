<template>
    <div :class="type">
      <div style="background:#eee;padding: 20px">
        <Card>
            <Button type="primary" style="margin-bottom: 20px;" @click="addMovie">添加电影</Button>
        </Card>
      </div>
      <Table :columns="columns1" :data="video_data"></Table>
      <Page :page-size-opts="pagesizeopts" :page-size="pageSize" :total="totalCount" :current="page" @on-change="getPage" @on-page-size-change="Pages" class="page-nav" show-sizer show-elevator show-total></Page>
      <!--添加模态框-->
      <Modal
        v-model="formShow"
        :title="formTitle"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form :model="form" :label-width="80">
          <input type="hidden" name="id" v-model="form.id"/>
          <FormItem label="名称">
              <Input type="text" v-model="form.name"/>
          </FormItem>
          <FormItem label="链接地址">
              <Input type="text" v-model="form.href"/>
          </FormItem>
          <FormItem label="封面图">
            <Upload
                      ref="upload"
                      type="drag"
                      :action="uploadUrl"
                      :on-success="uploadSuccess"
                      :on-exceeded-size="uploadMax"
                      name="image"
                      :data="uploadData">
                  <div style="padding: 20px 0" @click="clearUploadedImage">
                      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                      <p>点击或者着拽上传文件</p>
                  </div>
              </Upload>
            <img v-if="form.poster" :src="form.poster" width="30%" height="30%">
          </FormItem>
          <FormItem label="简介">
              <Input v-model="form.description" type="textarea" placeholder="输入电影简介" />
          </FormItem>
      </Form>
      </Modal>
    </div>
</template>
<script>
import {getDataList, postDataForm, getDataView, putDataForm, deleteData} from '@/api/data'
import {getNormalTime} from '@/libs/tools'
import { getToken } from '@/libs/util'
import config from '@/config'
export default {
  data () {
    return {
      uploadData: {'type': 'image'},
      uploadUrl: (process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro) + 'upload?token=' + getToken(),
      // 分页数据
      totalCount: 0,
      pageSize: 10,
      page: 1,
      pagesizeopts: [5, 10, 15],

      // 页面分类
      type: 'anime',
      // 模态框
      formShow: false,

      // 数据表单
      formTitle: '',
      form: {
        id: '',
        name: '',
        href: '',
        poster: '',
        description: ''
      },
      // 表格列
      columns1: [
        {
          title: 'Id',
          key: 'id',
          align: 'center'
        },
        {
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '封面图地址',
          key: 'poster',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                position: 'relative'
              }
            }, [
              h('img', {
                attrs: {
                  'src': params.row.poster,
                  'height': '50',
                  'width': '100'
                },
                style: {
                  margin: '10px auto 8px'
                }
              })
            ])
          }
        },
        {
          title: '链接地址',
          key: 'href',
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
      video_data: [
      ]
    }
  },
  created () {
    let urlArray = location.href.split('/')
    let urlPathArray = (urlArray[urlArray.length - 1]).split('_')
    this.type = urlPathArray[0]
    this.getInitData()
  },
  methods: {
    getInitData () {
      let params = new URLSearchParams()
      params.append('page', this.page)
      params.append('pageSize', this.pageSize)
      params.append('type', this.type)
      getDataList('videos', params).then(res => {
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
      this.formShow = true
      this.formTitle = '添加电影表单'
      this.form.name = ''
      this.form.id = ''
      this.form.href = ''
      this.form.poster = ''
      this.form.description = ''
    },
    ok () {
      let params = new URLSearchParams()
      params.append('name', this.form.name)
      params.append('href', this.form.href)
      params.append('type', this.type)
      params.append('poster', this.form.poster)
      params.append('description', this.form.description)
      if (this.form.id === '') { // 添加
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
      } else { // 编辑
        params.append('id', this.form.id)
        putDataForm('video', params).then(res => {
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
      this.formTitle = '编辑电影表单'
      let params = new URLSearchParams()
      params.append('id', row.id)
      getDataView('video', params).then(res => {
        this.form.id = res.data.info.id
        this.form.name = res.data.info.name
        this.form.href = res.data.info.href
        this.form.poster = res.data.info.poster
        this.form.description = res.data.info.description
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
      deleteData('video', params).then(res => {
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
    // 文件上传成功回调
    uploadSuccess (response) {
      if (response.message !== undefined) {
        this.$Message.error({
          content: response.message,
          duration: 3
        })
        return
      }
      this.form.poster = response.url
    },

    // 文件超出限制时
    uploadMax (file) {
      this.$Message.error({
        content: '超出文件大小限制文件 ' + file.name + ' 太大，不能超过 5M。',
        duration: 5
      })
      return false
    },
    clearUploadedImage () {
      this.$refs.upload.clearFiles()
    }
  }
}
</script>
