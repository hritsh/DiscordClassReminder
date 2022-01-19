import express from 'express';
const server = express();

function keepAlive(){
    server.listen(3000, ()=>{console.log("Server is Ready!")});
}

server.all('/', (req, res)=>{
    res.send('Your bot is alive!')
})

export default keepAlive;