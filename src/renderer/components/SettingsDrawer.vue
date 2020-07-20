<template>
  <div class="settings-drawer">
    <md-field>
      <label for="font">字体</label>
      <md-select v-model="fontFamily"
      name="font"
      id="font">
        <md-option
          v-for="(o, idx) in fontOptions"
          :key="idx" :value="idx"
          :style="'font-family: ' + o.value">
          {{ o.name }}
        </md-option>
      </md-select>
    </md-field>
    <!-- 字号 -->
    <md-field>
      <label>字号</label>
      <md-input v-model="fontSize" type="number"></md-input>
    </md-field>
    <label>主题</label>
    <ul class="color-picker">
      <li
        class="color-picker-item"
        v-for="(o, idx) in themeOptions"
        :key="idx"
        :class="activeTheme(o.label)"
        @click="setTheme(o.label)"
        :style="'color: ' + o.color + '; background: ' + o.background"
      >字</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SettingsDrawer',
  data () {
    return {
      fontFamily: 0,
      fontSize: 12,
      theme: null,
      fontSizeOption: {
        min: 12,
        max: 30,
        spl: 1
      }
    }
  },
  mounted () {
    this.fontFamily = this.$store.state.GlobalSettings.currentSettings.fontFamily
    this.fontSize = this.$store.state.GlobalSettings.currentSettings.fontSize
    this.theme = this.$store.state.GlobalSettings.currentSettings.theme
  },
  methods: {
    activeTheme (index) {
      return this.theme === index ? 'active' : ''
    },
    setTheme (theme) {
      this.theme = theme
      this.$store.dispatch('updateCurrentSettings', {'theme': theme})
    }
  },
  computed: {
    themeOptions () {
      let themes = []
      let _themes = this.$store.state.GlobalSettings.themes
      for (let i in _themes) {
        themes.push({..._themes[i], label: i})
      }
      return themes
    },
    fontOptions () {
      return this.$store.state.GlobalSettings.fontFamily
    }
  },
  watch: {
    fontSize () {
      this.$store.dispatch('updateCurrentSettings', {'fontSize': ~~this.fontSize})
    },
    fontFamily () {
      this.$store.dispatch('updateCurrentSettings', {'fontFamily': ~~this.fontFamily})
    }
  }
}
</script>

<style>
  .settings-drawer {
    margin-top: 30px
  }
  .active {
    cursor: default;
    border-color: #dcb476!important
  }
  .color-picker {
    padding-left: 0;
    display: block;
    width: 100%
  }
  .color-picker-item {
    width: 40px;
    height: 40px;
    display: inline-block;
    margin-right: 10px;
    line-height: 40px;
    font-size: 20px;
    text-align: center;
    background-color: #ccc;
    list-style-type: none;
    border: 2px transparent solid;
    border-radius: 20px;
    cursor: pointer
  }
</style>