const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://giedrius123:giedrius123@contactkeeper.y2il6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });

        console.log('MongoD Connected...');
    } catch (err) {
        console.error(err.message);

        process.exit(1);
    }
};

module.exports = connectDB;
