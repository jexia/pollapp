const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const jexiaSDK = require("jexia-sdk-js/node")
const field = require("jexia-sdk-js").field
const dataModule = jexiaSDK.dataOperations()
const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i
const isValidV4UUID = uuid => uuidV4Regex.test(uuid)

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('widget'))
app.use('/admin', express.static('dist'))

const credentials = {
    projectID: "6600e36b-4ecc-473b-ac50-d7795256b092",
    key: process.env.API_KEY,
    secret: process.env.API_SECRET
}

jexiaSDK.jexiaClient().init(credentials, dataModule);



app.get('/poll/:uuid', async (req, res) => {
    const uuid = req.params.uuid

    if(isValidV4UUID(uuid)) {
        await dataModule
        .dataset('polls')
        .select()
        .where(field('id').isEqualTo(uuid))
        .execute()
        .then(async records => {
            let poll = {
                id: records[0].id,
                name: records[0].name,
                message: records[0].message,
                questions: []
            }

            let questions = await dataModule
            .dataset('questions')
            .select()
            .where(field('poll_uuid').isEqualTo(uuid))
            .execute()
            .catch(() => {
                return res.sendStatus(500)
            })

            let answers = await dataModule
            .dataset('answers')
            .select()
            .where(field('poll_uuid').isEqualTo(uuid))
            .execute()
            .catch(() => {
                return res.sendStatus(500)
            })

            questions.forEach(question => {
                poll.questions.push({
                    id: question.id,
                    question: question.question,
                    order: question.order,
                    skipped: question.skipped ? true : false,
                    answers: []
                })
            })

            answers.forEach(answer => {
                poll.questions.find(question => {
                    return question.id === answer.question_uuid
                }).answers.push({
                    id: answer.id,
                    answer: answer.answer,
                    result: answer.result
                })
            })

            return res.json(poll)
        })

        .catch(error => {
            return res.json(error)
        })
    } else {
        return res.sendStatus(400)
    }
})

app.post('/vote/', async (req, res) => {
    //validate
    let answers = []
    req.body.forEach(answer => {
        if(isValidV4UUID(answer)) {
            answers.push(answer)
        }
    })

    if(answers.length === 0) {
        return res.sendStatus(400)
    }

    dataModule
    .dataset('answers')
    .select()
    .where(field('id').isInArray(answers))
    .execute()
    .then(records => {
        records.forEach(async answer => {
            answer.result++

            await dataModule.dataset('answers')
            .update({ result: answer.result })
            .where(field('id').isEqualTo(answer.id))
            .execute()
            .catch(() => {
                return res.sendStatus(500)
            })
        })

        return res.sendStatus(200)
    })
    .catch(() => {
        return res.sendStatus(500)
    })
})

app.listen(80, '0.0.0.0')
