import Vue from 'vue'
import Layout from './layout'
import FuncNav from './FuncNav'
import BookShelf from './BookShelf'
import SearchBar from './SearchBar'
import OptionMenu from './OptionMenu'
import TxtReader from './TxtReader'

export default {
  registerComponents () {
    Vue.component('layout', Layout)
    Vue.component('func-nav', FuncNav)
    Vue.component('book-shelf', BookShelf)
    Vue.component('search-bar', SearchBar)
    Vue.component('option-menu', OptionMenu)
    Vue.component('txt-reader', TxtReader)
  }
}
