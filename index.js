import express from 'express'

const app = express();
const port = process.env.PORT || 3000;

app.set('port',port);

app.get('/',(req,res) => {
    res.type('text/plain');
    res.send("testing...")
})

app.use((req,res) => {
    res.type("text/plain");
    res.status(404);
    res.send("404: Page not found")
})

app.listen(app.get('port'), () => {
    console.log(`Express running at ${port}`);
    console.log(`In browser go to: http://localhost:${port}`);
});
