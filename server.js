const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRoutes = require('./routes/postRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', postRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT, () =>
            console.log(`Server running on port ${process.env.PORT}`)
        );
    })
    .catch(err => console.error(err));
