<template>
  <layout>
    <router-link to="/" slot="header">
      <md-button class="md-icon-button">
        <md-icon class="md-primary">keyboard_arrow_left</md-icon>
      </md-button>
    </router-link>
    <div class="md-toolbar-section-end" slot="header">
      <md-button class="md-icon-button" @click='goto("0")'>
        <md-icon>add</md-icon>
      </md-button>
    </div>

    <md-table slot="content" v-model="sources" md-card @md-selected="onSelect">
      <!-- 显示已选择的数量和批量删除按钮 -->
      <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
        <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>
        <div class="md-toolbar-section-end">
          <!-- 删除按钮 -->
          <md-button class="md-icon-button">
            <md-icon>delete</md-icon>
          </md-button>
        </div>
      </md-table-toolbar>
      <!-- 数据行 -->
      <md-table-row
        slot="md-table-row"
        slot-scope="{ item }"
        md-selectable="multiple"
        md-auto-select>
        <md-table-cell>
          <span>{{ item.name }}</span>
          <span v-if="item.group && item.group !== ''">({{ item.group }})</span>
        </md-table-cell>
        <md-table-cell class="md-toolbar-section-end">
          <!-- 编辑当前书源 -->
          <md-button class="md-icon-button" @click='goto(item._id)'>
            <md-icon>edit</md-icon>
          </md-button>
          <!-- 删除单行 -->
          <md-button class="md-icon-button" @click='deleteOne(item._id)'>
            <md-icon>delete</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-dialog-confirm
      slot="content"
      :md-active.sync="needToDel"
      md-title="确定要删除当前书源?"
      :md-content="tip"
      md-confirm-text="确定"
      md-cancel-text="取消"
      @md-cancel="onCancel"
      @md-confirm="onConfirm" />
  </layout>
</template>
<script>
import BookSource from 'modules/storage/BookSource'
import { trace } from 'modules/util'

export default {
  name: 'BookSrcPage',
  data () {
    return {
      sources: [],
      rtd: null,
      needToDel: false,
      selected: [],
      tip: ''
    }
  },
  mounted () {
    BookSource.getAll()
      .then((err, sources) => {
        trace(err)
        sources.forEach(e => {
          let name = e.name
          let group = e.group
          let _id = e._id
          this.sources.push({
            name: name,
            group: group,
            _id: _id
          })
        })
      })
  },
  methods: {
    onSelect (items) {
      this.selected = items
      console.log(items)
    },
    onCancel () {
      this.needToDel = false
    },
    onConfirm () {
      for (let i in this.sources) {
        if (this.sources[i]._id === this.rtd._id) {
          this.sources.splice(i, 1)
          // 从数据库中删除数据
          BookSource.remove(this.rtd._id)
          break
        }
      }
    },
    deleteOne (_id) {
      // ready to delete
      this.rtd = null
      for (let i in this.sources) {
        if (this.sources[i]._id === _id) {
          console.log(this.sources[i])
          this.rtd = this.sources[i]
          break
        }
      }
      if (this.rtd) {
        // 弹确认对话框
        this.needToDel = true
        this.tip = this.rtd.name + '(' + this.rtd.group + ')'
      }
    },
    getAlternateLabel (count) {
      return `${count} 条规则被选中.`
    },
    goto (_id) {
      // 查看书源详情
      this.$router.push({name: 'sourcedetail', params: {id: _id}})
    }
  }
}
</script>

<style>
</style>