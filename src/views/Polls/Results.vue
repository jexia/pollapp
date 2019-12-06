<template>
    <div class="poll">
        <div class="results" v-if="!notFound">
            <h1 class="title">{{ poll.name }}</h1>
            <div class="question" v-for="question in poll.questions" v-bind:key="question.id">
                <h2 class="title">{{ question.question }}</h2>
                <table>
                    <thead>
                        <th>Answer</th>
                        <th>Result</th>
                        <th>Last vote</th>
                    </thead>
                    <tbody>
                        <tr v-for="answer in question.answers" v-bind:key="answer.id">
                            <td>{{ answer.answer }}</td>
                            <td>{{ answer.result }}</td>
                            <td>{{ formatDate(answer.updated_at) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="buttons">
                <button :class="{ disabled: busy }" :disabled="busy" v-on:click="refresh">Refresh</button>
                <router-link :to="{ name: 'update', params: { id: poll.id }}" tag="button" :class="{ disabled: busy }" :disabled="busy">Edit poll</router-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    #app .results {
        padding: 30px;
        width: 100%;

        .question {
            margin-bottom: 15px;
        }

        table {
            width: 100%;

            th {
                text-align: left;
            }
        }
    }
</style>

<script>
    import { mapState, mapGetters } from 'vuex'

    export default {
        data() {
            return {
                poll: {},
                notFound: false
            }
        },
        
        computed: {
            ...mapState([
                'busy'
            ]),
            ...mapGetters({
                getPollById: 'poll/getPollById'
            }),

            sortedPoll() {
                let poll = this.getPollById(this.$attrs.id);

                poll.questions.sort((a, b) => {
                    return a.order - b.order;
                });

                poll.questions.forEach(question => {
                    question.answers.sort((a, b) => {
                        return new Date(a.created_at) - new Date(b.created_at)
                    })
                })

                return poll;
            },
        },

        methods: {
            refresh() {
                this.$store.commit('setBusy', true)

                this.$store.dispatch('poll/getPolls')

                .then(() => {
                    this.poll = this.getPollById(this.$attrs.id)
                    this.$notify({
                        group: 'msg',
                        type: 'success',
                        title: 'Results updated'
                    })
                })

                .catch(() => {
                    this.$notify({
                        group: 'msg',
                        type: 'error',
                        title: 'Error occured'
                    })
                })

                .finally(() => {
                    this.$store.commit('setBusy', false)
                })
            },

            formatDate(input) {
                let date = new Date(input)

                let formatAMPM = date => {
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0'+minutes : minutes;
                    var strTime = hours + ':' + minutes + ' ' + ampm;
                    return strTime;
                }
                
                return `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} at ${formatAMPM(date)}`
            }
        },

        created() {
            let poll = this.getPollById(this.$attrs.id);

            if(poll) {
                this.poll = poll;
            } else {
                this.notFound = true;
                this.$router.push({ path: '/' })
            }
        },

        beforeRouteUpdate (to, from, next) {
            let poll = this.getPollById(to.params.id);

            if(poll) {
                this.poll = poll;
            } else {
                this.notFound = true;
                this.$router.push({ path: '/' })
            }

            next();
        }
    };
</script>