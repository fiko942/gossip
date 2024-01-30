import Database from './Database'

export default class User {
    private database: Database

    constructor({database}: {
        database: Database
    }) {
        this.database = database
    }
}