<template>
  <div class="article" style="width:60%">
    <Form :label-width="80">
        <FormItem label="用户名">
            <Input type="text" v-model="userForm.username"/>
        </FormItem>
        <FormItem label="密码">
            <Input type="text" v-model="userForm.password"/>
        </FormItem>
        <FormItem label="邮箱">
            <Input type="text" v-model="userForm.email"/>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="submit">确定</Button>
        </FormItem>
    </Form>
    <Spin size="large" fix v-if="spinShow"/>
  </div>
</template>

<script>
import {postDataForm} from '@/api/data'
export default {
  data () {
    return {
      spinShow: false,
      userForm: {
        username: '',
        password: '',
        email: ''
      }
    }
  },
  methods: {
    submit () {
      let params = new URLSearchParams()
      params.append('avatar', this.userForm.avatar)
      params.append('password', this.userForm.password)
      params.append('email', this.userForm.email)
      postDataForm('user/apply', params).then(res => {
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
