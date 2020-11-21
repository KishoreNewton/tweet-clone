const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connect();
  }

  async connect() {
    await mongoose
      .connect('mongodb://localhost/twitterclone', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      })
      .then(() => {
        console.log('🚀 Connected to database successfully');
      })
      .catch(err => {
        console.log('📶 Db connection failed', err);
      });
  }
}

module.exports = new Database();
