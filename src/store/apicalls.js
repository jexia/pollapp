import router from '@/router'
import Vue from 'vue'
import api from '@/helpers/api'
import { field } from 'jexia-sdk-js'



//   _____ _        _
//  / ____| |      | |
// | (___ | |_ __ _| |_ ___
//  \___ \| __/ _` | __/ _ \
//  ____) | || (_| | ||  __/
// |_____/ \__\__,_|\__\___|


const state = {
}



//   _____      _   _
//  / ____|    | | | |
// | |  __  ___| |_| |_ ___ _ __ ___
// | | |_ |/ _ \ __| __/ _ \ '__/ __|
// | |__| |  __/ |_| ||  __/ |  \__ \
//  \_____|\___|\__|\__\___|_|  |___/


const getters = {
}



//  __  __       _        _   _
// |  \/  |     | |      | | (_)
// | \  / |_   _| |_ __ _| |_ _  ___  _ __  ___
// | |\/| | | | | __/ _` | __| |/ _ \| '_ \/ __|
// | |  | | |_| | || (_| | |_| | (_) | | | \__ \
// |_|  |_|\__,_|\__\__,_|\__|_|\___/|_| |_|___/


const mutations = {
}



//               _   _
//     /\       | | (_)
//    /  \   ___| |_ _  ___  _ __  ___
//   / /\ \ / __| __| |/ _ \| '_ \/ __|
//  / ____ \ (__| |_| | (_) | | | \__ \
// /_/    \_\___|\__|_|\___/|_| |_|___/


const actions = {
    //    _       _   _
    //   /_\ _  _| |_| |_
    //  / _ \ || |  _| ' \
    // /_/ \_\_,_|\__|_||_|

    signIn(context, payload) {
        context.commit('setBusy', true, { root: true });

        api.login({ credentials: payload.credentials })

        .then(() => {
            Vue.notify({
                group: 'msg',
                type: 'success',
                title: 'Successfully logged in'
            })

            router.push({ path: '/' })
        })

        .catch(() => {
            Vue.notify({
                group: 'msg',
                type: 'error',
                title: 'Log in failed',
            })

            if(router.currentRoute.name !== 'login') {
                router.push({ path: '/login' })
            }
        })

        .finally(() => {
            context.commit('setBusy', false, { root: true })
        })
    },



    //  ___             _
    // | _ \___ __ _ __| |
    // |   / -_) _` / _` |
    // |_|_\___\__,_\__,_|

    getPolls() {
        return api.dataModule
        .dataset('polls')
        .select()
        .execute()
    },

    getQuestions() {
        return api.dataModule
        .dataset('questions')
        .select()
        .execute()
    },

    getAnswers() {
        return api.dataModule
        .dataset('answers')
        .select()
        .execute()
    },

    getAnswersByPollId(context, payload) {
        return api.dataModule
        .dataset('answers')
        .select()
        .where(field('poll_uuid').isEqualTo(payload.poll_uuid))
        .execute()
    },



    //   ___              _
    //  / __|_ _ ___ __ _| |_ ___
    // | (__| '_/ -_) _` |  _/ -_)
    //  \___|_| \___\__,_|\__\___|

    createPoll(context, payload) {
        return api.dataModule
        .dataset('polls')
        .insert(payload.poll)
        .execute()
    },

    createQuestions(context, payload) {
        return api.dataModule
        .dataset('questions')
        .insert(payload.questions)
        .execute()
    },

    createAnswers(context, payload) {
        return api.dataModule
        .dataset('answers')
        .insert(payload.answers)
        .execute()
    },



    //  _   _          _      _
    // | | | |_ __  __| |__ _| |_ ___
    // | |_| | '_ \/ _` / _` |  _/ -_)
    //  \___/| .__/\__,_\__,_|\__\___|
    //       |_|

    updatePoll(context, payload) {
        return api.dataModule
        .dataset('polls')
        .update({
            name: payload.poll.name,
            message: payload.poll.message
        })
        .where(field('id').isEqualTo(payload.poll.id))
        .execute()
    },

    updateQuestions(context, payload) {
        return Promise.all(payload.questions.map(question => {
            return api.dataModule
            .dataset('questions')
            .update({
                question: question.question,
                order: question.order,
                skipped: question.skipped ? true : false
            })
            .where(field('id').isEqualTo(question.id))
            .execute()
        }))
    },

    updateAnswers(context, payload) {
        return Promise.all(payload.answer.map(answer => {
            return api.dataModule
            .dataset('answers')
            .update({
                answer: answer.answer
            })
            .where(field('id').isEqualTo(answer.id))
            .execute()
        }))
    },



    //  ___      _     _
    // |   \ ___| |___| |_ ___
    // | |) / -_) / -_)  _/ -_)
    // |___/\___|_\___|\__\___|
    
    deletePoll(context, payload) {
        return Promise.all([
            api.dataModule
            .dataset('polls')
            .delete()
            .where(field('id').isEqualTo(payload.poll.id))
            .execute(),
            api.dataModule
            .dataset('questions')
            .delete()
            .where(field('poll_uuid').isEqualTo(payload.poll.id))
            .execute(),
            api.dataModule
            .dataset('answers')
            .delete()
            .where(field('poll_uuid').isEqualTo(payload.poll.id))
            .execute()
        ])
    },

    deleteQuestions(context, payload) {
        let questions = payload.questions.map(question => {
            return api.dataModule
            .dataset('questions')
            .delete()
            .where(field('id').isInArray(question.id))
            .execute()
        })

        let answers = payload.questions.map(question => {
            return api.dataModule
            .dataset('answers')
            .delete()
            .where(field('question_uuid').isInArray(question.id))
            .execute()
        })
        
        return Promise.all([
            ...questions,
            ...answers
        ])
    },

    deleteAnswers(context, payload) {
        let answers = payload.answers.map(el => {
            return el.id
        })

        return api.dataModule
        .dataset('answers')
        .delete()
        .where(field('id').isInArray(answers))
        .execute()
    }
}



export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}