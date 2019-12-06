<template>
  <div id="app">
    <Preloader></Preloader>
    <Nav v-if="showNav"></Nav>
    <div class="container" :class="{ login: !showNav }">
        <router-view/>
    </div>

    <notifications group="msg"/>
</div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue'
import Preloader from '@/components/Preloader.vue'

export default {
    name: 'app',

    components: {
        Nav,
        Preloader
    },

    computed: {
        showNav() {
            return this.$route.name !== 'login'
        }
    }
};
</script>


<style lang="scss">
body {
    margin: 0;
}

.vue-notification {
    &.success {
        background: green;
    }

    &.error {
        background: red;
    }
}

.disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2a2438;
    display: flex;

    .nav {
        width: 20%;
        padding: 15px 0;
    }

    .container {
        display: flex;
        width: 80%;
        margin-left: 20%;
    }

    .home {
        padding: 15px 30px;
    }

    .message {
        padding: 15px;
        border-radius: 5px;
        margin: 10px 0;

        .warning {
            background: yellow;
        }

        .error {
            background: red;
            color: #fff;
        }

        &-enter-active, &-leave-active {
            transition: opacity .5s;
        }
        &-enter, &-leave-to {
            opacity: 0;
            max-height: 0;
        }
    }

    .fa.delete {
        color: red;
        cursor: pointer;
    }

    .poll {
        width: 100%;
        
        display: flex;

        .create, .update {
            padding: 15px 30px;
        }

        .create {
            width: 100%;
        }

        .title {
            color: #8c8c8c;
        }

        .name {
            padding: 10px 15px;
            width: 100%;
            box-sizing: border-box;
            font-size: 20px;
        }

        button {
            padding: 10px;
            background: #222c28;
            text-transform: uppercase;
            border: 0;
            color: #fff;
            cursor: pointer;
        }

        .buttons {
            button {
                margin-right: 10px;

                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}
</style>