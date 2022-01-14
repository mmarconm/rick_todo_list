const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./controllers/authController")(app);
require("./controllers/projectController")(app);

// app.get('/', (req, res) => {
//     return res.send({message: 'OK'})
// })

app.listen(3000, () => {
    console.log('Running on port 3000')
});
