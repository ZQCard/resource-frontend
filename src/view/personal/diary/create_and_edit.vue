<template>
  <div class="article">
    <Form label-position="right" :label-width="100">
        <FormItem label="标题">
            <Input type="text" v-model="articleForm.title"/>
        </FormItem>
        <FormItem label="密钥">
            <Input type="text" v-model="articleForm.secret"/>
        </FormItem>
        <FormItem label="内容">
            <div :id="editorId"></div>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="submit">确定</Button>
        </FormItem>
    </Form>
    <Spin size="large" fix v-if="spinShow"/>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
import { oneOf } from '@/libs/tools'
import {postDataForm, getDataView, putDataForm} from '@/api/data'
export default {
  data () {
    return {
      spinShow: false,
      articleForm: {
        id: '',
        title: '',
        secret: '',
        content: ''
      }
    }
  },
  name: 'editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  created () {
    if (this.$route.params.id !== undefined) {
      let params = new URLSearchParams()
      params.append('id', this.$route.params.id)
      params.append('secret', this.$route.params.secret)
      getDataView('personal/diary', params).then(res => {
        this.articleForm.id = res.data.info.id
        this.articleForm.title = res.data.info.title
        this.articleForm.content = res.data.info.content
        this.articleForm.secret = res.data.info.secret
        this.editor.txt.text(res.data.info.content)
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
    }
  },
  methods: {
    setHtml (val) {
      this.editor.txt.html(val)
    },
    submit () {
      let that = this
      let params = new URLSearchParams()
      params.append('title', this.articleForm.title)
      params.append('secret', this.articleForm.secret)
      params.append('content', this.editor.txt.text())
      if (this.articleForm.id === '') { // 添加
        postDataForm('personal/diary', params).then(res => {
          this.$Message.success({
            content: res.data.message,
            duration: 3,
            onClose: function () {
              that.$router.push({name: '周二狗子'})
            }
          })
        })
      } else { // 编辑
        params.append('id', this.articleForm.id)
        putDataForm('personal/diary', params).then(res => {
          this.$Message.success({
            content: res.data.message,
            duration: 3,
            onClose: function () {
              that.$router.push({name: '周二狗子'})
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
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.onchange = (html) => {
      let text = this.editor.txt.text()
      if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    // create这个方法一定要在所有配置项之后调用
    this.editor.create()
    // 如果本地有存储加载本地存储内容
    let html = this.value || localStorage.editorCache
    if (html) this.editor.txt.html(html)
  }
}
</script>
