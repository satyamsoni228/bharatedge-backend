const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = 'mongodb+srv://bharatedge:Soni61492589@cluster0.cmjojk2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
 })
.then(() => console.log("Mongodb connected successfully..."))
.catch((err) => console.error('MongoDB connection error:', err));

module.exports = mongoose;
