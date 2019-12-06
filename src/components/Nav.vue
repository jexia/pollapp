<template>
  <div class="nav">
    <div class="header">
        <h1 class="title">My Polls</h1>
    </div>
    <div class="body">
        <ul>
            <router-link class="new" to="/create" tag="li"><i class="fa fa-plus"></i> Create new</router-link>
            <li class="refresh" v-on:click="refresh"><i class="fa fa-refresh"></i> Reload polls</li>

            <router-link class="item" v-for="poll in getPolls" v-bind:key="poll.uuid" :to="{ name: 'results', params: { id: poll.id }}" tag="li">
                <span class="title">{{ (poll.isDraft ? "Draft: " : "") + poll.name }}</span>
                <span class="date">{{ formatDate(poll.created_at) }}</span>
            </router-link>
        </ul>
    </div>
  </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex'
    import api from '@/helpers/api'

    export default{
        methods: {
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
                
                return `Created: ${date.getFullYear()}/${date.getMonth()}/${date.getDay()} at ${formatAMPM(date)}`
            },

            refresh() {
                this.$store.dispatch('poll/getPolls')
            }
        },
        computed: {
            ...mapGetters({
                getPolls: 'poll/getPolls'
            }),

            ...mapState([
                'authorized'
            ])
        },
        created() {
            api.login()
            .then(() => {
                this.$store.commit('setAuthorized', true)
                this.$store.dispatch('poll/getPolls')
                .then(() => {
                    this.$store.commit('setPreloader', false)
                })
            })
            .catch(() => {
                this.$notify({
                    group: 'msg',
                    type: 'error',
                    title: 'Not authorized',
                })

                this.$store.commit('setAuthorized', false)
                this.$store.commit('setPreloader', false)

                if(this.$router.currentRoute.name !== 'login') {
                    this.$router.push({ path: '/login' })
                }
            })
        }
    };
</script>

<style lang="scss">
    #app .nav {
        min-height: calc(100vh - 30px);
        max-height: calc(100vh - 30px);
        border-right: 2px solid #e6e6e6;
        position: fixed;
        overflow: auto;

        .header .title {
            color: #8c8c8c;
            padding: 0 15px;
        }

        .body {
            ul {
                padding: 0;

                li {
                    list-style: none;
                    padding: 15px 30px;
                    border-bottom: 2px solid #e6e6e6;
                    cursor: pointer;
                    transition: all 0.1s;
                }

                li.new {
                    padding: 20px;
                    text-align: center;
                    background: #fff;
                    border: 2px dashed #8c8c8c;
                    font-size: 20px;
                    color: #8c8c8c;
                    margin: 10px 15px;

                    &:hover {
                        color: #000;
                        border-color: #000;
                    }
                }

                li.refresh {
                    padding: 20px;
                    text-align: center;
                    background: #fff;
                    border: 2px solid #8c8c8c;
                    font-size: 20px;
                    color: #8c8c8c;
                    margin: 10px 15px;

                    &:hover {
                        color: #000;
                        border-color: #000;
                    }
                }

                li.item {
                    .title {
                        font-size: 20px;
                        display: block;
                        word-break: break-all;
                    }

                    .date {
                        font-size: 15px;
                    }

                    &:hover, &.router-link-active {
                        background: #f4f4f4;
                    }
                }
            }
        }
    }
</style>