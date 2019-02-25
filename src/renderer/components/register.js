import Vue from 'vue'
import Layout from './layout'
import FuncNav from './FuncNav'
import BookItem from './BookItem'
import BookShelf from './BookShelf'
import SearchBar from './SearchBar'
import OptionMenu from './OptionMenu'

export default {
  registerComponents () {
    Vue.component('layout', Layout)
    Vue.component('func-nav', FuncNav)
    Vue.component('book-item', BookItem)
    Vue.component('book-shelf', BookShelf)
    Vue.component('search-bar', SearchBar)
    Vue.component('option-menu', OptionMenu)
  }
}
