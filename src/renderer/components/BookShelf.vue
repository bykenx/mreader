<template>
  <div class="book-shelf">
    <div 
      v-for='book in books'
      class='book-item'
      :key='book.id'
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
        this.clicked(which.$id)
      }
    }
  }
}
</script>

<style>
  .book-item {
    padding: 20px;
    display: inline-block;
    cursor: pointer
  }
  .book-item .cover {
    width: 150px;
    height: 200px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.117647), 
                0 1px 4px rgba(0, 0, 0, 0.117647)
  }
  .book-item .cover img {
    width: 100%;
    height: 100%
  }
  .book-item .name {
    height: 30px;
    line-height: 30px;
    text-align: center
  }
</style>