import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        name: "",
        activities: []
    },
    mutations: {
        AddActivity(state, activity) {
            state.activities.push(activity)
        },
        SetName(state, name) {
            state.name = name
        }
    },
    getters: {
        activities: state => state.activities,
        name: state => state.name
    }
})