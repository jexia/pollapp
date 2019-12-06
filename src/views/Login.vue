<template>
    <div class="block">
        <div class="header"><i class="fa fa-commenting"></i> Login to Admin</div>
        <div class="body">
            <div class="switch">
                <div class="api" onclick="document.querySelector('.login').classList.remove('ums')" v-on:click="defaultMode('api')">API</div>
                <div class="ums" onclick="document.querySelector('.login').classList.add('ums')" v-on:click="defaultMode('ums')">UMS</div>
            </div>
            <div class="view">
                <div class="api">
                    <input type="text" placeholder="API key" v-model="api.key">
                    <input type="text" placeholder="secret key" v-model="api.secret">
                </div>
                <div class="ums">
                    <input type="email" placeholder="email" v-model="ums.email">
                    <input type="password" placeholder="password" v-model="ums.password">
                </div>
            </div>
        </div>
        <div class="footer">
            <button v-on:click="verify" :class="{ disabled: busy }" :disabled="busy">Login</button>
        </div>
        <div class="message">Access key will be saved in browser local storage</div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        data() {
            return {
                default: 'api',
                api: {
                    method: 'apk',
                    key: '',
                    secret: ''
                },
                ums: {
                    method: 'ums',
                    email: '',
                    password: ''
                }
            }
        },

        computed: {
            ...mapState([
                'busy'
            ])
        },

        methods: {

            verify() {
                if(this.default === 'api' && this.api.key.length > 0 && this.api.secret.length > 0) {
                    this.$store.dispatch('apicalls/signIn', { 
                        credentials: this.api
                    })
                } else if(this.default === 'ums' && this.ums.email.length > 0 && this.ums.password.length > 0) {
                    this.$store.dispatch('apicalls/signIn', { 
                        credentials: this.ums
                    })
                } else {
                    this.$notify({
                        group: 'error',
                        title: 'Fill all fields!'
                    })
                }
            },

            defaultMode(mode) {
                this.default = mode
            }
        }
    };
</script>

<style lang="scss">
    #app .login {
        width: 100%;
        margin: 0;
        display: flex;
        min-height: 100vh;
        justify-content: center;
        align-items: center;

        &.ums {
            .switch {
                .api {
                    background: #fff!important;
                    color: #222c28!important;
                }

                .ums {
                    background: #222c28;
                    color: #fff;
                }
            }

            .view {
                transform: translateX(-398px);
            }
        }

        .block {
            display: flex;
            flex-direction: column;
            min-width: 300px;

            .header {
                background: #222c28;
                color: #fff;
                text-align: center;
                padding: 10px;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
            }

            .body {
                display: flex;
                flex-direction: column;
                border: 1px solid #222c28;
                overflow: hidden;
                width: 398px;

                input {
                    padding: 10px;
                    border: 1px solid #222c28;
                }

                .switch {
                    display: flex;

                    div {
                        width: 50%;
                        text-align: center;
                        padding: 8px;
                        cursor: pointer;
                        transition: all 0.2s;
                    }

                    .api {
                        background: #222c28;
                        color: #fff;
                    }
                }

                .view {
                    display: flex;
                    width: 796px;
                    transition: all 0.2s;

                    div {
                        display: flex;
                        flex-direction: column;
                        width: 398px;
                    }
                }
            }

            .footer button {
                display: flex;
                width: 100%;
                background: #222c28;
                color: #fff;
                justify-content: center;
                border: 0;
                padding: 10px;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
                cursor: pointer;
            }

            .message {
                margin-top: 20px;
                color: grey;
            }
        }
    }
</style>