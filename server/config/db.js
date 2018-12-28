module.exports = {
  dev: {
    datebase: 'mongodb://localhost:27017/chat',
    secret: 'yoursecret'
  },
  prod: {
    datebase: 'mongodb://LukaszKo:Szybko10@mongocluster-shard-00-00-pabcs.mongodb.net:27017,mongocluster-shard-00-01-pabcs.mongodb.net:27017,mongocluster-shard-00-02-pabcs.mongodb.net:27017/test?ssl=true&replicaSet=MongoCluster-shard-0&authSource=admin',
    secret: 'YourSecretPasswordOnProduction'
  }
}
