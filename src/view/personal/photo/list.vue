<template>
    <div class="photos">
        <div><Button type="primary" style="margin-bottom: 20px;" @click="addPhoto">添加照片</Button></div>
        <Row>
            <Col span="6" offset="1" v-for="(photo, index) in photo_list" :key="index">
                <Card style="width:320px">
                    <div style="text-align:center">
                        <img :src="photo.url" width="260" height="300">
                        <h3>{{photo.description}}</h3>
                    </div>
                </Card>
            </Col>
        </Row>
        <Page :page-size-opts="pagesizeopts" :page-size="pageSize" :total="totalCount" :current="page" @on-change="getPage" @on-page-size-change="Pages" class="page-nav" show-sizer show-elevator show-total></Page>
        <Spin size="large" fix v-if="spinShow"/>

        <Modal
        v-model="formShow"
        title="上传照片"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form  :label-width="80">
          <FormItem label="照片">
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
                      <Icon type="md-eye" />
                      <p>点击或者着拽上传文件</p>
                  </div>
              </Upload>
            <img v-if="photo_url" :src="photo_url" width="30%" height="30%">
          </FormItem>
          <FormItem label="描述">
              <Input v-model="description" type="textarea" placeholder="输入描述" />
          </FormItem>
      </Form>
      </Modal>
    </div>

</template>
<script>
import {getDataList, postDataForm, getDataView} from '@/api/data'
import config from '@/config'
export default {
  data () {
    return {
      description: '',
      photo_url: '',
      spinShow: false,
      formShow: false,
      // 分页数据
      totalCount: 0,
      pageSize: 6,
      page: 1,
      pagesizeopts: [6, 9, 12],
      uploadUrl: config.baseUrl.qiniuUpload,
      uploadData: {},
      photo_list: []
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
      getDataList('personal/photos', params).then(res => {
        this.photo_list = res.data.list
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
    // 文件上传成功回调
    uploadSuccess (response) {
      this.photo_url = this.video_url = response.url
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
    ok () {
      let params = new URLSearchParams()
      params.append('url', this.photo_url)
      params.append('description', this.description)
      postDataForm('personal/photo', params).then(res => {
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
    addPhoto () {
      // 获取七牛云token
      let params = new URLSearchParams()
      getDataView('/qiniu-token', params).then(res => {
        this.uploadData = {type: 'video', token: res.data.token}
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
    },
    // 增加播放次数
    viewVideo (url) {
      let params = new URLSearchParams()
      params.append('url', url)
    }
  }
}
</script>
