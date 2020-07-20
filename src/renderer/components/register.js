import Vue from 'vue'
import Layout from './layout'
import FuncNav from './FuncNav'
import BookShelf from './BookShelf'
import SearchDrawer from './SearchDrawer'
import TxtReader from './TxtReader'
import EpubReader from './EpubReader'
import SettingsDrawer from './SettingsDrawer'

export default {
  // 将在应用启动时注册组件
  registerComponents () {
    Vue.component('layout', Layout)
    Vue.component('func-nav', FuncNav)
    Vue.component('book-shelf', BookShelf)
    Vue.component('txt-reader', TxtReader)
    Vue.component('epub-reader', EpubReader)
    Vue.component('search-drawer', SearchDrawer)
    Vue.component('settings-drawer', SettingsDrawer)
  }
}
