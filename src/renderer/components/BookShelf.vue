<template>
  <div class="book-shelf">
    <book-item 
      v-for="{no, name, pic} in books" 
      :cover="pic" 
      :name="name"
      :key="no">
    </book-item>
  </div>
</template>

<script>
// https://vuematerial.io/assets/examples/card-sky.jpg
export default {
  'name': 'BookShelf',
  data: () => ({
    mode: 'list', // grid
    books: [{
      no: 1,
      name: '绝世唐门',
      pic: 'https://vuematerial.io/assets/examples/card-sky.jpg'
    },
    {
      no: 2,
      name: '斗罗大陆',
      pic: 'https://vuematerial.io/assets/examples/card-sky.jpg'
    },
    {
      no: 3,
      name: '斗罗大陆',
      pic: 'https://vuematerial.io/assets/examples/card-sky.jpg'
    },
    {
      no: 4,
      name: '斗罗大陆',
      pic: 'https://vuematerial.io/assets/examples/card-sky.jpg'
    },
    {
      no: 5,
      name: '斗罗大陆',
      pic: 'https://vuematerial.io/assets/examples/card-sky.jpg'
    },
    {
      no: 6,
      name: '斗罗大陆',
      pic: 'https://vuematerial.io/assets/examples/card-sky.jpg'
    },
    {
      no: 7,
      name: '斗罗大陆',
      pic: 'https://vuematerial.io/assets/examples/card-sky.jpg'
    }]
  })
}
</script>

<style lang="css">
  .book-item {
    cursor: pointer;
  }
</style>