<template>
  <div class="article" style="width:60%">
    <Form :label-width="80">
        <FormItem label="用户名">
            <Input type="text" v-model="userForm.username" disabled/>
        </FormItem>
        <FormItem label="密码">
            <Input type="text" v-model="userForm.password" placeholder="不填写则不修改"/>
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
            <img v-if="userForm.avatar" :src="userForm.avatar" width="30%" height="30%">
        </FormItem>
        <FormItem>
            <Button type="primary" @click="submit">确定</Button>
        </FormItem>
    </Form>
    <Spin size="large" fix v-if="spinShow"/>
  </div>
</template>

<script>
import {getDataView, putDataForm} from '@/api/data'
import { getToken } from '@/libs/util'
import config from '@/config'
export default {
  data () {
    return {
      uploadUrl: config.baseUrl.qiniuUpload,
      uploadData: {},
      spinShow: false,
      userForm: {
        id: '',
        username: '',
        password: '',
        avatar: ''
      }
    }
  },
  created () {
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

    let params2 = new URLSearchParams()
    params2.append('token', getToken())
    getDataView('user', params2).then(res => {
      let data = res.data.user
      this.userForm.id = data.id
      this.userForm.username = data.username
      this.userForm.avatar = data.avatar
    })
  },
  methods: {
    submit () {
      let params = new URLSearchParams()
      params.append('id', this.userForm.id)
      params.append('avatar', this.userForm.avatar)
      params.append('password', this.userForm.password)
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
    },
    // 文件上传成功回调
    uploadSuccess (response) {
      this.userForm.avatar = this.video_url = process.env.NODE_ENV === 'production' ? config.baseUrl.qiniuURL + response.hash : response.url
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
