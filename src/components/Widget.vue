<template>
    <div class="widget">
        <div class="code">
            <h3 class="title"><i class="fa fa-code"></i> Javascript web widget snippet</h3>
            <code>
                &lt;div id="pollapp_widget"&gt;&lt;/div&gt;
                &lt;script&gt;s_p_w_poll_uuid="{{ poll.id }}"&lt;/script&gt;
                &lt;script src="http://13fdb418-0318-4c0c-b344-7780db36f2ba.jexia.app/index.js"&gt;&lt;/script&gt;
            </code>
        </div>
        <router-link tag="button" :to="{ name: 'results', params: { id: poll.id }}">Check the results</router-link>
    </div>
</template>

<script>
    export default {
        props: ['poll']
    };
</script>

<style lang="scss">
    #app .widget {
        min-height: calc(100vh - 30px);
        max-height: calc(100vh - 30px);
        position: fixed;
        right: 0;
        width: 25%;
        padding: 15px;
        background: #222c28;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .code {
            padding-top: 30px;
            overflow: auto;

            .title {
                text-align: center;
                margin: 0;
                margin-bottom: 15px;
            }
        }

        button {
            background: #19915a
        }
    }
</style>
