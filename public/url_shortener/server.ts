import express, { Request } from "express"
import sqlite from "sqlite3"
let app = express()
let db = new sqlite.Database("data.db")
app.use(express.json())
db.exec(
    `CREATE TABLE IF NOT EXISTS urls ( short VARCHAR(10), pointedTo VARCHAR );`
)
function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
app.get("/output.css", (_, res)=>{
    res.sendFile(__dirname+"/output.css")
})


app.post("/new", (req: Request<{}, {}, {url: string}>, res) => {
    let gen = generateRandomString(10)
    db.prepare("INSERT INTO urls VALUES (?, ?)").run(gen, req.body.url).finalize()

    return res.send({
        urlPath: gen
    })
})

app.get("/:url", (req, res)=>{
    db.each(`SELECT * FROM urls WHERE short=?`, req.params.url, (err: any, row: {pointedTo: string})=>{
        res.redirect( 301,row.pointedTo,)
    })
   
})

app.listen(3000, () => {
    console.log("server listening at 3000")
})