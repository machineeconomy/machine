import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        activities: []
    },
    mutations: {
        AddActivity(state, activity) {
            state.activities.push(activity)
        }
    },
    getters: {
        activities: state => state.activities
    }
})