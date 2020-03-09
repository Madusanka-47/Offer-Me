var MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://dumalk:dumalk@cluster0-yx3nh.mongodb.net/test?retryWrites=true&w=majority";

var DbConnection = () => {

    var db = null;
    var instance = 0;

    async function DbConnect() {
        try {
            let url = 'mongodb+srv://dumalk:dumalk@cluster0-yx3nh.mongodb.net/test?retryWrites=true&w=majority';
            let _db = await MongoClient.connect(url);

            return _db
        } catch (e) {
            return e;
        }
    }

    async function Get() {
        try {
            instance++;     // this is just to count how many times our singleton is called.
            console.log(`DbConnection called ${instance} times`);

            if (db != null) {
                console.log(`db connection is already alive`);
                return db;
            } else {
                console.log(`getting new db connection`);
                db = await DbConnect();
                console.log(db)
                return db;
            }
        } catch (e) {
            return e;
        }
    }

    return {
        Get: Get
    }
}


module.exports = DbConnection();
