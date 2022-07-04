const express = require('express');
const morgan = require('morgan');
const splitRoutes = require("./routes/splitRoutes");
const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use("/split-payments", splitRoutes);

app.use((req, res) => {  
    res.status(404).json({
         message: "The route that you want to access does not exist"
       });
})

let port = process.env.SERVER_PORT || 8000;
app.listen(port, () => { console.log(`Server started on port ${port}`); })


