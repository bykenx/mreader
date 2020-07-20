<template>
  <md-field>
    <md-input v-model="inputSource" placeholder="A nice placeholder"></md-input>
  </md-field>
</template>

<script>
export default {
  name: 'SearchDrawer',
  data () {
    return {
      inputSource: ''
    }
  }
}
</script>

<style>
  .md-field {
    display: inline-block
  }
</style>
