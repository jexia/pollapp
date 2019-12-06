import Vue from 'vue'
import Vuex from 'vuex'
import poll from './poll'
import apicalls from './apicalls'

Vue.use(Vuex)

export default new Vuex.Store({
    namespaced: true,
    modules: {
        poll,
        apicalls
    },

    state: {
        busy: false,
        authorized: false,
        preloader: true
    },

    getters: {
    },

    mutations: {
        setBusy(state, payload) {
            state.busy = payload
        },
        setAuthorized(state, payload) {
            state.busy = payload
        },
        setPreloader(state, payload) {
            state.preloader = payload
        }
    }
})
