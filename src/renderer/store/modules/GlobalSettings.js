const state = {
  fontFamily: [
    { name: '微软雅黑', value: 'Microsoft Yahei, Heiti SC, Heiti TC' },
    { name: '宋体', value: 'SimSun, Songti SC, Songti TC' },
    { name: '楷体', value: 'KaiTi, Kaiti SC, Kaiti TC' },
    { name: '幼圆', value: 'YouYuan, Yuanti SC, Yuanti TC' },
    { name: '苹方', value: 'PingFang SC, PingFang TC' }
  ],
  // 颜色参考 “MD 配色参考”
  themes: {
    'default': {color: '#000', background: '#fff'},
    'theme2': {color: '#fff', background: '#000'},
    'theme3': {color: '#fff', background: '#795548'},
    'theme4': {color: '#fff', background: '#9e9e9e'},
    'theme5': {color: '#fff', background: '#607d8b'}
  },
  currentSettings: {
    // fontFamily: 0,
    // fontSize: 12,
    // theme: 'default'
  }
}

const mutations = {
  LOAD_SETTINGS (state, all) {
    for (let i in all) {
      state[i] = all[i]
    }
  },
  RESET_CURRENTSETTINGS (state) {
    state.currentSettings = {
      fontFamily: 0,
      fontSize: 12,
      theme: 'default'
    }
  },
  UPDATE_CURRENTSETTINGS (state, obj) {
    for (var i in obj) {
      state.currentSettings[i] = obj[i]
    }
  }
}

const actions = {
  loadSettings ({ commit }) {
    commit('LOAD_SETTINGS', {})
  },
  updateCurrentSettings ({ commit }, obj) {
    commit('UPDATE_CURRENTSETTINGS', obj)
  }
}

export default {
  state,
  mutations,
  actions
}
