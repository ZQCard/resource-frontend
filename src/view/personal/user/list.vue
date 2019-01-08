<template>
    <div class="user_list">
      <div style="background:#eee;padding: 20px">
        <Card>
            <Button type="primary" style="margin-bottom: 20px;" @click="addUser">添加用户</Button>
        </Card>
      </div>
      <Table :columns="columns" :data="user_data"></Table>
      <Modal
        v-model="formShow"
        :title="formTitle"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form :model="form" :label-width="80">
          <input type="hidden" name="id" v-model="form.id"/>
          <FormItem label="用户名">
              <Input type="text" v-model="form.username"/>
          </FormItem>
          <FormItem label="密码">
              <Input type="text" v-model="form.password"/>
          </FormItem>
          <FormItem label="头像">
            <Upload
                      ref="upload"
                      type="drag"
                      :action="uploadUrl"
                      :on-success="uploadSuccess"
                      :on-exceeded-size="uploadMax"
                      name="file"
                      multiple
                      :data="uploadData">
                  <div style="padding: 20px 0" @click="clearUploadedImage">
                      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                      <p>点击或者着拽上传文件</p>
                  </div>
              </Upload>
            <img v-if="form.avatar" :src="form.avatar" width="30%" height="30%">
          </FormItem>
      </Form>
      </Modal>

      <Modal
        v-model="assignmentFormShow"
        title="角色授予"
        @on-ok="assignment_ok"
        @on-cancel="cancel">
        <Form :model="assignmentForm" :label-width="80">
          <input type="hidden" name="id" v-model="assignmentForm.id"/>
          <CheckboxGroup v-model="assignmentForm.roleHas">
            <Checkbox v-for="(item,key) in assignmentForm.roles" :key="key" true-value :label="item" >
              <span>{{item}}</span>
            </Checkbox>
          </CheckboxGroup>
      </Form>
      </Modal>
      <Page :page-size-opts="pagesizeopts" :page-size="pageSize" :total="totalCount" :current="page" @on-change="getPage" @on-page-size-change="Pages" class="page-nav" show-sizer show-elevator show-total></Page>
      <Spin size="large" fix v-if="spinShow"/>
    </div>
</template>
<script>
import {getDataList, postDataForm, getDataView, putDataForm, deleteData, recoverData} from '@/api/data'
import {getNormalTime} from '@/libs/tools'
import config from '@/config'
export default {
  data () {
    return {
      spinShow: false,
      // 分页数据
      totalCount: 0,
      pageSize: 10,
      page: 1,
      pagesizeopts: [5, 10, 15],
      uploadUrl: config.baseUrl.qiniuUpload,
      uploadData: {},
      // 模态框
      formShow: false,
      assignmentFormShow: false,
      // 数据表单
      formTitle: '',
      form: {
        id: '',
        username: '',
        password: '',
        avatar: ''
      },
      // 表格列
      columns: [
        {
          title: 'Id',
          key: 'id',
          align: 'center'
        },
        {
          title: '用户名',
          key: 'username',
          align: 'center'
        },
        {
          title: '头像',
          key: 'avatar',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                position: 'relative'
              }
            }, [
              h('img', {
                attrs: {
                  'src': params.row.avatar,
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
          title: '删除时间',
          key: 'deleted_at',
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
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.assignment(params.row)
                  }
                }
              }, '授权'),
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
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.recover(params.row)
                  }
                }
              }, '恢复'),
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
      user_data: [
      ],
      assignmentForm: {
        id: '',
        roles: [
        ],
        roleHas: []
      }
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
      getDataList('users', params).then(res => {
        // 数据处理
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].created_at = getNormalTime(res.data.list[i].created_at)
          if (res.data.list[i].deleted_at != null) {
            res.data.list[i].deleted_at = getNormalTime(res.data.list[i].deleted_at)
          }
        }
        this.user_data = res.data.list
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
    addUser () {
      this.formShow = true
      this.formTitle = '添加用户'
      this.form.username = ''
      this.form.password = ''
      this.form.id = ''
      this.form.avatar = ''

      // 获取七牛云token
      let params = new URLSearchParams()
      getDataView('/qiniu-token', params).then(res => {
        this.uploadData = {type: 'image', token: res.data.token}
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
    ok () {
      let params = new URLSearchParams()
      params.append('username', this.form.username)
      params.append('password', this.form.password)
      params.append('avatar', this.form.avatar)
      if (this.form.id === '') { // 添加
        postDataForm('user', params).then(res => {
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
        putDataForm('user', params).then(res => {
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
      // 获取七牛云token
      let params = new URLSearchParams()
      getDataView('/qiniu-token', params).then(res => {
        this.uploadData = {type: 'image', token: res.data.token}
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

      this.formShow = true
      // 请求查看详情
      this.formTitle = '编辑用户信息'
      params = new URLSearchParams()
      params.append('id', row.id)
      getDataView('user', params).then(res => {
        let data = res.data.user
        this.form.id = data.id
        this.form.username = data.username
        this.form.avatar = data.avatar
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
      deleteData('user', params).then(res => {
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
    recover (row) {
    // 恢复记录
      let params = new URLSearchParams()
      params.append('id', row.id)
      recoverData('/user/recover', params).then(res => {
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
      this.form.avatar = this.video_url = response.url
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
    },
    assignment (user) {
      this.assignmentFormShow = true
      // 请求授权情况
      let params = new URLSearchParams()
      params.append('id', user.id)
      this.assignmentForm.id = user.id
      getDataView('assignment', params).then(res => {
        this.assignmentForm.id = user.id
        if (res.data.roles != null) {
          this.assignmentForm.roles = res.data.roles
        }
        if (res.data.userRoles.has != null) {
          this.assignmentForm.roleHas = res.data.userRoles.has
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
      this.formShow = false
    },
    assignment_ok () {
      let params = new URLSearchParams()
      params.append('id', this.assignmentForm.id)
      params.append('roles', this.assignmentForm.roleHas)
      postDataForm('assign', params).then(res => {
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
