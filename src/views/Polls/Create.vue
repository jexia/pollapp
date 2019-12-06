<template>
    <div class="poll">
        <div class="create">
            <h1 class="title">New poll</h1>
            <input class="name" type="text" placeholder="type poll name" v-model="poll.name" required="required" minlength="3" maxlength="255">

            <p class="warning">
                Web widget snippet will appear after you create new poll
            </p>

            <Questions v-bind:poll="sortedPoll"></Questions>

            <div class="buttons">
                <button v-on:click="createPoll(poll)" :class="{ disabled: busy }" :disabled="busy">Create poll</button>
                <router-link to="/" tag="button" :class="{ disabled: busy }" :disabled="busy">Cancel</router-link>
            </div>
        </div>
    </div>
</template>

<script>

    import { mapState, mapGetters } from 'vuex'
    import uuidv4 from 'uuid/v4'
    import Questions from '@/components/Questions'
    
    let poll_uuid = uuidv4();
    let question_uuid = uuidv4();

    export default {
        components: {
            Questions
        },

        data() {
            return {
                poll: {
                    name: null,
                    message: null,
                    created_at: new Date(),
                    id: poll_uuid,
                    questions: [
                        {
                            id: question_uuid,
                            question: null,
                            order: 1,
                            poll_uuid: poll_uuid,
                            skip: false,
                            answers: [
                                {
                                    id: uuidv4(),
                                    question_uuid: question_uuid,
                                    answer: null,
                                    result: 0
                                },
                                {
                                    id: uuidv4(),
                                    question_uuid: question_uuid,
                                    answer: null,
                                    result: 0
                                }
                            ]
                        }
                    ]
                }
            }
        },

        computed: {
            ...mapState([
                'busy'
            ]),

            ...mapGetters({
                validatePoll: 'poll/validatePoll'
            }),

            sortedPoll() {
                let poll = this.poll;

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
            createPoll(poll) {
                if(this.validatePoll({ poll: poll })) {
                    
                    this.$store.commit('setBusy', true)

                    this.$store.dispatch('poll/createPoll', { poll: this.poll })

                    .then(response => {

                        this.$router.push({ name: 'update', params: { id: response.id }})
                        this.$notify({
                            group: 'msg',
                            type: 'success',
                            title: 'Poll is created'
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
                        this.$store.commit('setBusy', false, { root: true })
                    })
                }
            }
        },
    };
</script>