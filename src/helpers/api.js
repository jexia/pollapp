import { jexiaClient, dataOperations, UMSModule } from 'jexia-sdk-js/browser'
const projectID = '6600e36b-4ecc-473b-ac50-d7795256b092'
const dataModule = new dataOperations();
const ums = new UMSModule();

export default {
    isAuthorized: false,
    dataModule: dataModule,
    login(payload = undefined) {
        return new Promise((resolve, reject) => {
            if(payload) {
                this.auth(payload.credentials)
                .then(response => {
                    localStorage.setItem('credentials', JSON.stringify(payload.credentials))
                    this.isAuthorized = true
                    return resolve(response)
                })
                .catch(error => {
                    localStorage.removeItem('credentials')
                    this.isAuthorized = false
                    return reject(error)
                })
            } else {
                let credentials = this.retrieveCredentials()

                if(!credentials) {
                    this.isAuthorized = false
                    return reject(new Error('No saved user'))
                }

                this.auth(credentials)
                .then(response => {
                    this.isAuthorized = true
                    return resolve(response)
                })
                .catch(error => {
                    localStorage.removeItem('credentials')
                    this.isAuthorized = false
                    return reject(error)
                })
            }
        })
    },
    auth(credentials) {
        return new Promise((resolve, reject) => {
            if(credentials && credentials.method) {
                if(credentials.method === 'apk') {
                    jexiaClient().init({
                        projectID: projectID,
                        key: credentials.key,
                        secret: credentials.secret
                    }, dataModule)
                    .then(response => {
                        return resolve(response)
                    })
                    .catch(error => {
                        return reject(error)
                    })
                } else if(credentials.method === 'ums') {
                    jexiaClient().init({
                        projectID: projectID
                    }, ums, dataModule)

                    ums.signIn({
                        email: credentials.email,
                        password: credentials.password,
                        default: true
                    })
                    .then(response => {
                        return resolve(response)
                    })
                    .catch(error => {
                        return reject(error)
                    })
                }
            } else {
                return reject()
            }
        })
    },
    retrieveCredentials() {
        let credentials = localStorage.getItem('credentials')
        return credentials ? JSON.parse(credentials) : undefined
    }
}