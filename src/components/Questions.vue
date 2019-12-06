<template>
    <div class="questions">
        <transition-group tag="ul" name="questions">
            <li class="field" v-for="question in poll.questions" v-bind:key="question.id" :class="{ skipped: question.skipped }">
                <div class="order">{{ question.order }}</div>
                <div class="header">
                    <span class="title">Radio buttons</span>
                    <i class="fa fa-trash fa-lg delete" v-if="poll.questions.length > 1" v-on:click="deleteQuestion(question.id)"></i>
                </div>
                <div class="body">
                    <p class="question">
                        <input type="text" placeholder="type your question" v-model="question.question" required="required" minlength="3" maxlength="255">
                    </p>
                    <transition-group tag="ul" name="answers">
                        <li class="answer" v-for="answer in question.answers" v-bind:key="answer.id">
                            <span>Answer</span>
                            <input type="text" required="required" minlength="3" maxlength="255" placeholder="type your answer" v-model="answer.answer">
                            <i class="fa fa-trash fa-lg delete" v-if="question.answers.length > 2" v-on:click="deleteAnswer(question.id, answer.id)"></i>
                        </li>
                    </transition-group>
                    <ul class="end">
                        <li class="answer">
                            <button v-on:click="addAnswer(question.id)">Add more answer</button>
                        </li>
                    </ul>
                </div>
                <div class="footer">
                    <div>
                        Order: <i class="fa fa-chevron-up" v-on:click="changeOrder('up', question)" :class="{ disabled: question.order === 1 }" :disabled="question.order === 1"></i> <span class="number">{{ question.order }}</span> <i class="fa fa-chevron-down" v-on:click="changeOrder('down', question)" :class="{ disabled: question.order === poll.questions.length }" :disabled="question.order === poll.questions.length"></i>
                    </div>
                    <div>
                        <label>Skip: <input type="checkbox" v-model="question.skipped"></label>
                    </div>
                </div>
            </li>
        </transition-group>


        <ul>
            <li class="more" v-on:click="addQuestion">
                <i class="fa fa-plus"></i> Add more radio buttons
            </li>

            <li class="field">
                <div class="order">{{ poll.questions.length + 1 }}</div>
                <div class="header">
                    <span class="title">Message</span>
                </div>
                <div class="body">
                    <textarea v-model="poll.message" required="required" minlength="3" maxlength="255"></textarea>
                </div>
                <div class="footer">
                    Order: <span class="number">{{ poll.questions.length + 1 }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
    .questions {
            &>ul {
                padding: 0;
                padding-top: 15px;

                li.more {
                    list-style: none;
                    padding: 40px 20px;
                    border: 3px dashed #8c8c8c;
                    color: #8c8c8c;
                    position: relative;
                    margin-bottom: 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;
                    transition: all 0.1s;
                    cursor: pointer;

                    &:hover {
                        color: #000;
                        border-color: #000;
                    }

                    i {
                        margin-right: 10px;
                    }
                }

                li.field {
                    list-style: none;
                    background: #efefef;
                    padding: 20px;
                    border: 1px solid #9b9b9b;
                    position: relative;
                    margin-bottom: 30px;

                    &.skipped {
                        opacity: 0.6;
                    }

                    .order {
                        position: absolute;
                        top: -17px;
                        left: -17px;
                        background: #4d4d4d;
                        color: #fff;
                        border-radius: 50%;
                        width: 34px;
                        height: 34px;
                        display: flex;
                        justify-content: center;
                        align-items: center
                    }

                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .title {
                            font-size: 20px;
                        }
                    }

                    .body {
                        margin: 15px 0;

                        input, textarea {
                            padding: 10px 15px;
                            width: 100%;
                            box-sizing: border-box;
                        }

                        textarea {
                            min-height: 150px;
                            max-width: 100%;
                            min-width: 100%;
                            width: 100%;
                        }

                        .question {
                            margin: 0;
                        }

                    ul {
                        li.answer {
                            padding: 10px 0;
                            position: relative;
                            list-style: none;
                            display: flex;
                            align-items: center;

                            &:before, &:after {
                                content: '';
                                display: block;
                                position: absolute;
                            }

                            &:before {
                                height: 60px;
                                width: 15px;
                                border-left: 2px dashed #000;
                                top: 0;
                                left: -20px;
                            }

                            &:after {
                                height: 1px;
                                width: 15px;
                                border-top: 2px dashed #000;
                                top: 28px;
                                left: -20px;
                            }

                            span {
                                margin-right: 10px;
                            }

                            i {
                                margin-left: 10px;
                            }
                        }

                        &.end li.answer:before {
                            height: 30px;
                        }
                    }
                }

                .footer {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;

                    &>div {
                        margin-right: 15px;
                    }

                    .number {
                        font-size: 20px;
                    }

                    i {
                        cursor: pointer;
                    }

                    i.disabled {
                        opacity: 0.3;
                        cursor: not-allowed;
                    }
                }
            }
        }
        .questions-move, .answers-move {
            transition: 1s;
        }

        .questions-enter-active, .questions-leave-active, .answers-enter-active, .answers-leave-active {
            transition: all 0.5s;
        }

        .questions-enter, .questions-leave, .answers-enter, .answers-leave {
            opacity: 0;
        }

        .questions-enter, .questions-leave {
            max-height: 0;
            overflow: hidden;
            margin: 0;
        }
    }

</style>

<script>
    import uuidv4 from 'uuid/v4';

    export default {
        props: [ 'poll' ],
        name: 'questions',
        methods: {
            changeOrder(direction, question) {
                let order = question.order;

                if(direction == 'up' && order !== 1) {

                    this.poll.questions.find(el => {
                        return el.order === order - 1;
                    }).order = order;

                    question.order -= 1;

                } else if (direction === 'down' && order !== this.poll.questions.length) { 
                    this.poll.questions.find(el => {
                        return el.order === order + 1;
                    }).order = order;

                    question.order += 1;
                }
            },

            rearrangeOrder(questionId) {
                let questionIndex = this.poll.questions.findIndex(el => {
                    return el.id === questionId
                })

                for(let i = questionIndex + 1; i < this.poll.questions.length; i++) {
                    this.poll.questions[i].order--;
                }
            },


            addAnswer(questionId) {
                let answer = {
                    type: 'answer',
                    isAdded: true,
                    id: uuidv4(),

                    question_uuid: questionId,
                    answer: '',
                    result: 0,
                }

                this.poll.questions.find((el) => {
                    return el.id === questionId
                }).answers.push(answer);
            },
            deleteAnswer(questionId, answerId) {
                let questionIndex = this.poll.questions.findIndex(el => {
                    return el.id === questionId
                });

                let question = this.poll.questions[questionIndex];

                let answerIndex = question.answers.findIndex(el => {
                    return el.id === answerId
                });

                this.$delete(question.answers, answerIndex);
            },


            addQuestion() {
                let question = {
                    type: 'question',
                    isAdded: true,
                    id: uuidv4(),

                    poll_uuid: this.poll.id,
                    order: this.poll.questions.length + 1,
                    answers: []
                }

                this.poll.questions.push(question);

                this.addAnswer(question.id);
                this.addAnswer(question.id);
            },
            deleteQuestion(questionId) {
                let questionIndex = this.poll.questions.findIndex(el => {
                    return el.id === questionId
                });

                let question = this.poll.questions[questionIndex];

                let answers = [...question.answers];

                answers.forEach(el => {
                    this.deleteAnswer(questionId, el.id);
                })

                this.rearrangeOrder(questionId);

                this.$delete(this.poll.questions, questionIndex);
            }
        }
    };
</script>