import BookSource from '../../modules/storage/BookSource'
import Source from '../../modules/spider/BookSource'

const state = {
  sources: []
}

const mutations = {
  LOAD_SOURCES (state, sources) {
    state.sources = sources.map(e => {
      return new Source(e)
    })
  }
}

const actions = {
  loadSources ({ commit }) {
    BookSource.getAll()
      .then(sources => {
        commit('LOAD_SOURCES', sources)
      })
  }
}

export default {
  state,
  mutations,
  actions
}
