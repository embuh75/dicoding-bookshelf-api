const express = require('express');
const app = express();
const port = 9000;

//middleware
app.use(express.json());

//Routing
const booksRoute = require('./src/routes/booksRoutes');
app.use(booksRoute);

app.listen(port, () => {
    console.log(`Api berjalan di http://localhost:${port}`);
});
