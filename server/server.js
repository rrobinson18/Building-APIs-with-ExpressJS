const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const path = require('path');


let app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('client'));


app.use('/api', apiRoutes);


app.listen(3000);