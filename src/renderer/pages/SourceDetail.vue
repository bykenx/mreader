<template>
  <layout>
    <router-link to="/source" slot="header">
      <md-button class="md-icon-button">
        <md-icon class="md-primary">keyboard_arrow_left</md-icon>
      </md-button>
    </router-link>
    <div slot="header" class="md-toolbar-section-end">
      <md-button class="md-icon-button" @click="save">
        <md-icon class="md-primary">save</md-icon>
      </md-button>
      <md-button class="md-icon-button">
        <md-icon class="md-primary">more</md-icon>
      </md-button>
    </div>
    <div slot="content" class="editarea" 
      v-if="source">
      <md-field>
        <label>书源地址</label>
        <md-input v-model="source.url"></md-input>
        <span class="md-helper-text">书源地址(url)</span>
      </md-field>
      <md-field>
        <label>书源名称</label>
        <md-input v-model="source.name"></md-input>
        <span class="md-helper-text">书源名称(name)</span>
      </md-field>
      <md-field>
        <label>书源分组</label>
        <md-input v-model="source.group"></md-input>
        <span class="md-helper-text">书源分组(group)</span>
      </md-field>
      <md-field>
        <label>搜索地址</label>
        <md-input v-model="source.searchUrl"></md-input>
        <span class="md-helper-text">搜索地址(searchUrl)</span>
      </md-field>
      <md-field>
        <label>搜索结果列表规则</label>
        <md-input v-model="source.searchListRule"></md-input>
        <span class="md-helper-text">搜索结果列表规则(searchListRule)</span>
      </md-field>
      <md-field>
        <label>书名规则</label>
        <md-input v-model="source.searchNameRule"></md-input>
        <span class="md-helper-text">书源规则(searchNameRule)</span>
      </md-field>
      <md-field>
        <label>作者规则</label>
        <md-input v-model="source.searchAuthorRule"></md-input>
        <span class="md-helper-text">书源规则(searchAuthorRule)</span>
      </md-field>
      <md-field>
        <label>封面规则</label>
        <md-input v-model="source.searchCoverRule"></md-input>
        <span class="md-helper-text">封面规则(searchCoverRule)</span>
      </md-field>
      <md-field>
        <label>类型规则</label>
        <md-input v-model="source.searchKindRule"></md-input>
        <span class="md-helper-text">书源规则(searchKindRule)</span>
      </md-field>
      <md-field>
        <label>最新章节规则</label>
        <md-input v-model="source.searchLastChapterRule"></md-input>
        <span class="md-helper-text">最新章节规则(searchLastChapterRule)</span>
      </md-field>
      <md-field>
        <label>详情页面地址规则</label>
        <md-input v-model="source.detailUrlRule"></md-input>
        <span class="md-helper-text">详情页面地址规则(detailUrlRule)</span>
      </md-field>
      <md-field>
        <label>详情页书名规则</label>
        <md-input v-model="source.detailNameRule"></md-input>
        <span class="md-helper-text">详情页书名规则(detailNameRule)</span>
      </md-field>
      <md-field>
        <label>详情页作者规则</label>
        <md-input v-model="source.detailAuthorRule"></md-input>
        <span class="md-helper-text">详情页作者规则(detailAuthorRule)</span>
      </md-field>
      <md-field>
        <label>详情页封面规则</label>
        <md-input v-model="source.detailCoverRule"></md-input>
        <span class="md-helper-text">详情页封面规则(detailCoverRule)</span>
      </md-field>
      <md-field>
        <label>详情页类型规则</label>
        <md-input v-model="source.detailKindRule"></md-input>
        <span class="md-helper-text">详情页类型规则(detailKindRule)</span>
      </md-field>
      <md-field>
        <label>详情页最新章节规则</label>
        <md-input v-model="source.detailLastChapterRule"></md-input>
        <span class="md-helper-text">详情页最新章节规则(detailLastChapterRule)</span>
      </md-field>
      <md-field>
        <label>章节页面地址规则</label>
        <md-input v-model="source.chapterUrlRule"></md-input>
        <span class="md-helper-text">章节页面地址规则(chapterUrlRule)</span>
      </md-field>
      <md-field>
        <label>章节列表规则</label>
        <md-input v-model="source.chapterListRule"></md-input>
        <span class="md-helper-text">章节列表规则(chapterListRule)</span>
      </md-field>
      <md-field>
        <label>章节名称规则</label>
        <md-input v-model="source.chapterNameRule"></md-input>
        <span class="md-helper-text">章节名称规则(chapterNameRule)</span>
      </md-field>
      <md-field>
        <label>正文页面地址规则</label>
        <md-input v-model="source.contentUrlRule"></md-input>
        <span class="md-helper-text">正文页面地址规则(contentUrlRule)</span>
      </md-field>
      <md-field>
        <label>正文内容规则</label>
        <md-input v-model="source.contentRule"></md-input>
        <span class="md-helper-text">正文内容规则(contentRule)</span>
      </md-field>
    </div>
  </layout>
</template>

<style>
.editarea {
  margin-left: 30px;
  margin-right: 30px;
}
</style>

<script>
  import BookSource from 'modules/storage/BookSource'
  import { trace } from 'modules/util'
  export default {
    name: 'sourcedetail',
    data () {
      return {
        source: {}
      }
    },
    mounted () {
      let _id = this.$route.params.id
      // id 非 0 表示编辑现有的源
      // id 为 0 则表示新建源，则没有任何操作
      if (_id !== '0') {
        BookSource.getById(_id).then((err, data) => {
          trace(err)
          this.source = data[0]
        })
      }
    },
    methods: {
      save () {
        // 保存到本地数据库
        BookSource.save(this.source)
          .then((err, e) => {
            console.log(err)
          })
      }
    }
  }
</script>

<style scoped>
  .md-input {
    width: 100%
  }
</style>