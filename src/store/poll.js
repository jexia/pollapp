import router from '@/router'
import Vue from 'vue'
import _ from 'lodash'

const state = {
    polls: [],
    newPolls: []
}



//  _    _      _
// | |  | |    | |
// | |__| | ___| |_ __   ___ _ __ ___
// |  __  |/ _ \ | '_ \ / _ \ '__/ __|
// | |  | |  __/ | |_) |  __/ |  \__ \
// |_|  |_|\___|_| .__/ \___|_|  |___/
//               | |
//               |_|


function difference(object, base) {
    function changes(object, base) {
        return _.transform(object, function(result, value, key) {
            if (!_.isEqual(value, base[key])) {
                result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value
            }
        })
    }
    return changes(object, base)
}

Vue.prototype.$_ = _



//   _____      _   _
//  / ____|    | | | |
// | |  __  ___| |_| |_ ___ _ __ ___
// | | |_ |/ _ \ __| __/ _ \ '__/ __|
// | |__| |  __/ |_| ||  __/ |  \__ \
//  \_____|\___|\__|\__\___|_|  |___/                                    

const getters = {
    validatePoll: () => payload => {
        let poll = payload.poll

        let error = false

        if (poll.name === null || !poll.name || poll.name.length === 0) {
            error = true
        }

        if (poll.message === null || !poll.message || poll.message.length === 0) {
            error = true
        }

        poll.questions.forEach(question => {
            if (question.question === null || !question.question || question.question.length === 0) {
                error = true
            }

            question.answers.forEach(answer => {
                if (answer.answer === null || !answer.answer || answer.answer.length === 0) {
                    error = true
                }
            })
        })

        if (error) {
            Vue.notify({
                group: 'msg',
                type: 'error',
                title: 'Fill all data'
            })
        }

        return !error
    },
    
    getPolls: state => {
        return [...state.polls, ...state.newPolls].sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at)
        });
    },

    getPollById: state => {
        return id => {
            return [...state.polls, ...state.newPolls].find(element => {
                return element.id === id;
            });
        }
    },

    getNewPoll: state => {
        return state.newPolluuid;
    }
}



//  __  __       _        _   _
// |  \/  |     | |      | | (_)
// | \  / |_   _| |_ __ _| |_ _  ___  _ __  ___
// | |\/| | | | | __/ _` | __| |/ _ \| '_ \/ __|
// | |  | | |_| | || (_| | |_| | (_) | | | \__ \
// |_|  |_|\__,_|\__\__,_|\__|_|\___/|_| |_|___/

const mutations = {
    //  ___
    // / __| __ ___ _____
    // \__ \/ _` \ V / -_)
    // |___/\__,_|\_/\___|

    savePolls(state, payload) {
        state.polls = payload.polls

        state.polls.forEach(poll => {
            poll.questions = []
        })
    },

    savePoll(state, payload) {
        state.polls.push(payload.poll)
    },

    saveQuestions(state, payload) {
        payload.questions.forEach(question => {
            question.answers = question.answers ? question.answers : []

            let poll = state.polls.find(poll => {
                return poll.id === question.poll_uuid
            })

            if(poll) {
                poll.questions.push(question)
            }
        })
    },

    saveAnswers(state, payload) {
        payload.answers.forEach(answer => {
            state.polls.forEach(poll => {
                let question = poll.questions.find(question => {
                    return question.id === answer.question_uuid
                })

                if(question) {
                    question.answers.push(answer)
                }
            })
        });
    },



    //  _   _          _      _
    // | | | |_ __  __| |__ _| |_ ___
    // | |_| | '_ \/ _` / _` |  _/ -_)
    //  \___/| .__/\__,_\__,_|\__\___|
    //       |_|

    updatePoll(state, payload) {
        let index = state.polls.findIndex(el => {
            return el.id === payload.poll.id
        })

        Vue.set(state.polls, index, Object.assign(state.polls[index], {
            name: payload.poll.name,
            message: payload.poll.message
        }))
    },

    updateQuestions(state, payload) {
        payload.questions.forEach(question => {
            let pollIndex = state.polls.findIndex(el => {
                return el.id === question.poll_uuid
            })

            let index = state.polls[pollIndex].questions.findIndex(el => {
                return el.id === question.id
            })

            Vue.set(state.polls[pollIndex].questions, index,
                Object.assign(state.polls[pollIndex].questions[index], {
                    question: question.question,
                    order: question.order,
                    skipped: question.skipped ? true : false
                })
            )
        })
    },

    updateAnswers(state, payload) {
        payload.answers.forEach(answer => {
            let pollIndex = state.polls.findIndex(el => {
                return el.id === answer.poll_uuid
            })

            let questionIndex = state.polls[pollIndex].questions.findIndex(el => {
                return el.id === answer.question_uuid
            })

            let index = state.polls[pollIndex].questions[questionIndex].answers.findIndex(el => {
                return el.id === answer.id
            })

            Vue.set(state.polls[pollIndex].questions[questionIndex].answers, index,
                Object.assign(state.polls[pollIndex].questions[questionIndex].answers[index], {
                    answer: answer.answer,
                    result: answer.result
                })
            )
        })
    },



    //  ___      _     _
    // |   \ ___| |___| |_ ___
    // | |) / -_) / -_)  _/ -_)
    // |___/\___|_\___|\__\___|

    deletePoll(state, payload) {
        let index = state.polls.findIndex(poll => {
            return poll.id === payload.poll.id
        })

        Vue.delete(state.polls, index)
        router.push('/')
    },

    deleteQuestions(state, payload) {
        payload.questions.forEach(question => {
            let pollIndex = state.polls.findIndex(el => {
                return el.id === question.poll_uuid
            })

            let questionIndex = state.polls[pollIndex].questions.findIndex(el => {
                return el.id === question.id
            })

            Vue.delete(state.polls[pollIndex].questions, questionIndex)
        })
    },

    deleteAnswers(state, payload) {
        payload.answers.forEach(answer => {
            let pollIndex = state.polls.findIndex(el => {
                return el.id === answer.poll_uuid
            })

            let questionIndex = state.polls[pollIndex].questions.findIndex(el => {
                return el.id === answer.question_uuid
            })

            let answerIndex = state.polls[pollIndex].questions[questionIndex].findIndex(el => {
                return el.id === answer.id
            })

            Vue.delete(state.polls[pollIndex].questions[questionIndex].answers, answerIndex)
        })
    }
    
}



//               _   _
//     /\       | | (_)
//    /  \   ___| |_ _  ___  _ __  ___
//   / /\ \ / __| __| |/ _ \| '_ \/ __|
//  / ____ \ (__| |_| | (_) | | | \__ \
// /_/    \_\___|\__|_|\___/|_| |_|___/

const actions = {
    //  ___             _
    // | _ \___ __ _ __| |
    // |   / -_) _` / _` |
    // |_|_\___\__,_\__,_|
    
    async getPolls(context) {
        context.commit('setBusy', true, { root: true })

        let polls = await context.dispatch('apicalls/getPolls', null, { root: true })
        let questions = await context.dispatch('apicalls/getQuestions', null, { root: true })
        let answers = await context.dispatch('apicalls/getAnswers', null, { root: true })

        context.commit('savePolls', { polls: polls })
        context.commit('saveQuestions', { questions: questions })
        context.commit('saveAnswers', { answers: answers })
        
        Vue.notify({
            group: 'msg',
            type: 'success',
            title: 'Polls are loaded'
        })

        context.commit('setBusy', false, { root: true })
    },

    getAnswersByPollId(context, payload) {
        return new Promise((resolve, reject) => {
            context.dispatch('apicalls/getAnswersByPollId' , {
                poll_uuid: payload.poll_uuid
            } , { root: true })

            .then(response => {
                context.commit('updateAnswers', {
                    answers: response
                })

                resolve(response)
            })

            .catch(error => {
                reject(error)
            })
        })
    },

    //   ___              _
    //  / __|_ _ ___ __ _| |_ ___
    // | (__| '_/ -_) _` |  _/ -_)
    //  \___|_| \___\__,_|\__\___|
    
    createPoll(context, payload) {
        return new Promise((resolve, reject) => {
            context.dispatch('apicalls/createPoll', { poll: {
                name: payload.poll.name,
                message: payload.poll.message
            } }, { root: true })

            .then(response => {
                let poll = response[0]

                let questions = payload.poll.questions.map(question => {
                    return {
                        poll_uuid: poll.id,
                        question: question.question,
                        order: question.order,
                        skipped: question.skipped,
                        answers: question.answers
                    }
                })

                context.dispatch('createQuestions', {
                    questions: questions
                })

                .then(response => {
                    poll.questions = response
                    context.commit('savePoll', { poll: poll })
                    resolve(poll)
                })

                .catch(error => {
                    reject(error)
                })
            })

            .catch(error => {
                reject(error)
            })
        })
    },

    createQuestions(context, payload) {
        return new Promise((resolve, reject) => {
            let questions = []
            let questionsAnswers = []

            payload.questions.forEach(question => {
                questions.push({
                    poll_uuid: question.poll_uuid,
                    question: question.question,
                    order: question.order,
                    skipped: question.skipped ? true : false
                })

                questionsAnswers.push(question.answers)
            })

            context.dispatch('apicalls/createQuestions', {
                questions: questions
            }, { root: true })

            .then(response => {
                let questions = response
                let answers = []

                questionsAnswers.forEach((question, index) => {
                    question.forEach(answer => {
                        answers.push({
                            question_uuid: questions[index].id,
                            poll_uuid: questions[index].poll_uuid,
                            answer: answer.answer,
                            result: 0
                        })
                    })
                })

                context.dispatch('createAnswers', {
                    answers: answers
                })

                .then(response => {
                    questions.forEach(question => {
                        question.answers = []
                    })

                    response.forEach(answer => {
                        questions.find(question => {
                            return question.id === answer.question_uuid
                        }).answers.push(answer)
                    })

                    context.commit('saveQuestions', { questions: questions })
                    
                    resolve(questions)
                })

                .catch(error => {
                    reject(error)
                })
            })

            .catch(error => {
                reject(error)
            })
        })
    },

    createAnswers(context, payload) {
        return new Promise((resolve, reject) => {
            context.dispatch('apicalls/createAnswers', {
                answers: payload.answers
            }, { root: true })

            .then(response => {
                context.commit('saveAnswers', { answers: response })
                resolve(response)
            })

            .catch(error => {
                reject(error)
            })
        })
    },



    //  _   _          _      _
    // | | | |_ __  __| |__ _| |_ ___
    // | |_| | '_ \/ _` / _` |  _/ -_)
    //  \___/| .__/\__,_\__,_|\__\___|
    //       |_|

    updatePoll(context, payload) {
        return new Promise((resolve, reject) => {
            context.dispatch('apicalls/updatePoll', {
                poll: {
                    id: payload.poll.id,
                    name: payload.poll.name,
                    message: payload.poll.message
                }
            }, { root: true })

            .then(response => {
                let poll = response[0]
                poll.questions = response
                context.commit('updatePoll', { poll: poll })
                resolve(poll)
            })

            .catch(error => {
                reject(error)
            })

            context.dispatch('updateQuestions', {
                questions: payload.poll.questions,
                originQuestions: payload.originPoll.questions,
                poll: payload.poll
            })

            .catch(error => {
                reject(error)
            })
        })
    },

    updateQuestions(context, payload) {
        return new Promise((resolve, reject) => {



            // Existing Questions

            let before = []
            let after = []

            payload.questions.forEach(question => {
                let origin = payload.originQuestions.find(el => {
                    return el.id === question.id
                })

                if(!_.isEmpty(origin)) {
                    before.push(origin)
                    after.push(question)
                }
            })



            // Define changes

            let diffs = []

            _.differenceWith(after, before, _.isEqual).forEach(question => {
                let originQuestion = before.find(el => { return el.id === question.id })
                let changes = difference({
                    question: question.question,
                    order: question.order,
                    skipped: question.skipped
                }, {
                    question: originQuestion.question,
                    order: originQuestion.order,
                    skipped: originQuestion.skipped
                })

                if(!_.isEmpty(changes)) {
                    changes.id = question.id
                    diffs.push(changes)
                }
            })

            if(!_.isEmpty(diffs)) {
                context.dispatch('apicalls/updateQuestions', {
                    questions: diffs
                }, { root: true })

                .then(response => {
                    let questions = response.map(el => {
                        return el[0]
                    })

                    context.commit('updateQuestions', { questions: questions })
                })

                .catch(error => {
                    reject(error)
                })
            }



            // Update answers
            let answers = []
            let originAnswers = []

            after.forEach(question => {
                question.answers.forEach(answer => {
                    answers.push(answer)
                })
            })

            before.forEach(question => {
                question.answers.forEach(answer => {
                    originAnswers.push(answer)
                })
            })

            context.dispatch('updateAnswers', {
                answers: answers,
                originAnswers: originAnswers,
                poll_uuid: payload.poll.id
            })

            .catch(error => {
                reject(error)
            })



            // Added questions

            let added = _.filter(payload.questions, el => {
                return el.isAdded
            }).map(el => {
                el.poll_uuid = payload.poll.id
                return el
            })

            if(!_.isEmpty(added)) {
                context.dispatch('createQuestions', {
                    questions: added
                })

                .catch(error => {
                    reject(error)
                })
            }



            // Deleted questions

            let deleted = _.differenceWith(payload.originQuestions, payload.questions, (a, b) => {
                return a.id === b.id
            })

            if(!_.isEmpty(deleted)) {
                context.dispatch('deleteQuestions', {
                    questions: deleted
                })

                .catch(error => {
                    reject(error)
                })
            }



        })
    },

    updateAnswers(context, payload) {
        return new Promise((resolve, reject) => {
            let after = []
            let before = []

            payload.answers.forEach(answer => {
                let origin = payload.originAnswers.find(el => {
                    return el.id === answer.id
                })

                if(!_.isEmpty(origin)) {
                    before.push(origin)
                    after.push(answer)
                }
            })

            let added = _.filter(payload.answers, el => {
                return el.isAdded
            }).map(el => {
                return {
                    poll_uuid: payload.poll_uuid,
                    question_uuid: el.question_uuid,
                    answer: el.answer,
                    result: 0
                }
            })

            let deleted = _.differenceWith(payload.originAnswers, payload.answers, (a, b) => {
                return a.id === b.id
            })

            let diffs = []

            _.differenceWith(payload.answers, payload.originAnswers, _.isEqual).forEach(answer => {
                if(!answer.isAdded) {
                    let originAnswer = payload.originAnswers.find(el => { return el.id === answer.id })
                    let changes = difference({
                        answer: answer.answer
                    }, {
                        answer: originAnswer.answer
                    })

                    if(!_.isEmpty(changes)) {
                        changes.id = answer.id
                        diffs.push(changes)
                    }
                }
            })

            if(!_.isEmpty(deleted)) {
                context.dispatch('deleteAnswers', {
                    answers: deleted
                })

                .catch(error => {
                    reject(error)
                })
            }

            if(!_.isEmpty(added)) {
                context.dispatch('createAnswers', {
                    answers: added
                })

                .catch(error => {
                    reject(error)
                })
            }

            if(!_.isEmpty(diffs)) {
                context.dispatch('apicalls/updateAnswers', {
                    answers: diffs
                }, { root: true })

                .then(response => {
                    let answers = response.map(el => {
                        return el[0]
                    })
                    context.commit('updateAnswers', { answers: answers })
                    resolve(response)
                })

                .catch(error => {
                    reject(error)
                })
            }

            resolve()
        })
    },



    //  ___      _     _
    // |   \ ___| |___| |_ ___
    // | |) / -_) / -_)  _/ -_)
    // |___/\___|_\___|\__\___|
    
    deletePoll(context, payload) {
        return new Promise((resolve, reject) => {
            context.dispatch('apicalls/deletePoll', {
                poll: payload.poll
            }, { root: true })

            .then(response => {
                context.commit('deletePoll', { poll: payload.poll })
                
                resolve(response)
            })

            .catch(error => {
                reject(error)
            })
        })
    },

    deleteQuestions(context, payload) {
        return new Promise((resolve, reject) => {
            context.dispatch('apicalls/deleteQuestions', {
                questions: payload.questions
            }, { root: true })

            .then(response => {
                context.commit('deleteQuestions', { questions: payload.questions })
                resolve(response)
            })

            .catch(error => {
                reject(error)
            })
        })
    },

    deleteAnswers(context, payload) {
        return new Promise((resolve, reject) => {
            context.dispatch('apicalls/deleteAnswers', {
                answers: payload.answers
            }, { root: true })

            .then(response => {
                context.commit('deleteAnswers', { answers: payload.answers })
                resolve(response)
            })

            .catch(error => {
                reject(error)
            })
        })
    }
}



export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}