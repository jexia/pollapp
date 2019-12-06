<template>
    <transition v-if="preloader" name="preloader">
        <div id="preloader">
            {{ loading }}
        </div>
    </transition>
</template>

<style lang="scss">
    #preloader {
        height: 100vh;
        width: 100%;
        background: #fff;
        z-index: 9999;
        justify-content: center;
        align-items: center;
        display: flex;
        position: fixed;
        font-size: 2em;
    }

    .preloader-enter-active,
    .preloader-leave-active {
        transition: opacity .5s
    }

    .preloader-enter,
    .preloader-leave-to {
        opacity: 0
    }
</style>

<script>
    import { mapState } from 'vuex'

    export default {
        data() {
            return {
                dots: 1,
                loop: undefined
            }
        },

        computed: {
            ...mapState({
                preloader: 'preloader'
            }),

            loading() {
                let dot = ''

                for(let i = 0; i < this.dots; i++) {
                    dot += '.'
                }

                return 'Loading' + dot
            },
        },

        methods: {
            update() {
                if(this.dots === 3) {
                    this.dots = 1
                } else {
                    this.dots++
                }
            },

            interval(state) {
                if(state) {
                    this.loop = setInterval(() => {
                        this.update()   
                    }, 500)
                } else {
                    clearInterval(this.loop)
                }
            }
        },

        created() {
            this.interval(true)
            this.$store.subscribe((mutation, state) => {
                if(mutation.type === 'setPreloader') {
                    this.interval(state.preloader)
                }
            })
        }
    };
</script>