<template>
    <div class="allocate_routes">
      <div style="background:#eee;padding: 20px">
        <Card>
            <Button type="primary" style="margin-bottom: 20px;" @click="addRole">添加角色</Button>
        </Card>
      </div>
      <Table :columns="columns" :data="roles"></Table>
      <Modal
        v-model="modelShow"
        :title="modelTitle"
        :styles="{width: '800px'}"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form :model="form" :label-width="80">
          <input type="hidden" name="id" v-model="form.id"/>
          <FormItem label="角色名称">
              <Input type="text" v-model="form.role"/>
          </FormItem>
          <Transfer
          filterable
          :titles="titles"
          :list-style="listStyle"
          :data="routes"
          :target-keys="routesHas"
          @on-change="handleChange1"></Transfer>
      </Form>
    </Modal>
    </div>
</template>
<script>
import {getDataList, postDataForm, deleteData} from '@/api/data'
export default {
  data () {
    return {
      titles: [
        '未拥有路由',
        '已拥有路由'
      ],
      listStyle: {
        margin: '3%',
        width: '300px',
        height: '300px'
      },
      modelShow: false,
      modelTitle: '',
      form: {
        role: ''
      },
      columns: [
        {
          title: '角色名',
          key: 'role'
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
      roles: [

      ],
      roleRoutes: {},
      routes: [],
      routesHas: [],
      routesInit: []
    }
  },
  created () {
    this.getInitData()
  },
  methods: {
    getInitData () {
      this.spinShow = true
      let params = new URLSearchParams()
      getDataList('auth', params).then(res => {
        if (res.data.roles != null) {
          for (var i = 0; i < res.data.roles.length; i++) {
            var obj = {}
            obj.role = res.data.roles[i]
            this.roles.push(obj)
          }
        }
        // 处理路由列表
        this.routesInit = this.processArrayToTrsanfer(res.data.routes)
        this.routes = this.processArrayToTrsanfer(res.data.routes)

        // 角色路由列表
        this.roleRoutes = res.data.roleRoutes
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
    addRole () {
      this.modelShow = true
      this.modelTitle = '新增角色'
      this.form.role = ''
      this.routesHas = []
      this.routes = this.routesInit
    },
    Delete (row) {
      // 删除记录
      let params = new URLSearchParams()
      params.append('name', row.role)
      deleteData('role', params).then(res => {
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
    },
    ok () {
      let params = new URLSearchParams()
      params.append('role', this.form.role)
      params.append('routes', this.routesHas)
      postDataForm('role', params).then(res => {
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
    handleChange1 (newTargetKeys, direction, moveKeys) {
      this.routesHas = newTargetKeys
    },
    viewInfo (role) {
      this.modelShow = true
      this.form.role = role.role
      for (var i in this.roleRoutes) {
        if (i === role.role) {
          this.routesHas = this.roleRoutes[i].yes
        }
      }
    },
    processArrayToTrsanfer (arr) {
      let objData = []
      for (var i in arr) {
        objData.push({
          key: arr[i],
          label: arr[i]
        })
      }
      return objData
    }
  }
}
</script>
