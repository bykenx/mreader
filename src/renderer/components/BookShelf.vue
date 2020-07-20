<template>
  <div class="book-shelf">
    <div 
      class='book-item'
      v-for='book in books'
      :key='book._id'
      @click='click(book)'>
      <div class="cover"><img :src="book.cover"></div>
      <div class="name">{{ book.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookShelf',
  data () {
    return {
      books: []
    }
  },
  props: {
    value: {
      type: [Array, Object],
      required: true
    },
    clicked: {
      type: Function,
      required: false
    },
    index: {
      type: String,
      required: false,
      default: '_id'
    }
  },
  watch: {
    value (newValue) {
      this.books = newValue
    }
  },
  methods: {
    click (which) {
      if (this.clicked && this.clicked instanceof Function) {
        this.clicked(which[this.index])
      }
    }
  }
}
</script>

<style>
  .book-item {
    width: 190px;
    padding: 20px;
    display: inline-block;
    cursor: pointer
  }
  .book-item .cover {
    width: 100%;
    height: 200px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.117647), 
                0 1px 4px rgba(0, 0, 0, 0.117647)
  }
  .book-item .cover img {
    width: 100%;
    height: 100%
  }
  .book-item .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 30px;
    line-height: 30px;
    text-align: center
  }
</style>