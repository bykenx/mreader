<template>
  <div class="book-item" @click="openBook">
    <div class="cover">
      <img :src="cover">
    </div>
    <div class="name">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'book-item',
  methods: {
    openBook () {
      location.href = this.link
    }
  },
  props: {
    cover: {
      type: String,
      default: function () {
        return '@/assets/examples/card-sky.jpg'
      }
    },
    name: String,
    link: {
      type: String,
      default: function () {
        return '#'
      }
    }
  }
}
</script>

<style>
  .book-item {
    padding: 20px;
    display: inline-block
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
