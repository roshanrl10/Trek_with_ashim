import express from 'express';

const app = express();

app.get('/api', (req,res)=>{
    res.send('hello from the server')

})

app.listen(5000,()=>{
    console.log('server started at http://localhost:5000')
})