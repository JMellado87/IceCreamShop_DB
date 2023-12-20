const pg = require('pg')
const client = new pg.Client('postgres://localhost/flavors_db')
const express = require('express')
const app = express()
const cors =require('cors')

app.use(cors())
// // app.get('/', (req, res, next) => {
//     res.send("Hello world")
// })

//GET all flavors
app.get('/api/flavors', async (req,res,next) => {
    try {
        const SQL = `
        SELECT * FROM flavors;
        `
        console.log("in db")
    
        const response = await client.query(SQL)
        //res.status(202)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

//GET one flavors
app.get('/api/flavors/:id' , async (req,res,next) => {
    try {
        console.log(req.params.id)
                                          // id=$1 $1 means first element 
        const SQL = `
        SELECT * from flavors WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        
        if(!response.rows.length){
            next({
                name: "id error",
                message: `flavors with ${req.params.id} not found`
            })
        }else{

            res.send(response.rows[0])
        }

    } catch (error) {
        next(error)
    }

})

//DELETE flavors area ***************************************
app.delete('/api/flavors/:id', async (req,res, next) => {
    try {
        const SQL = `
        DELETE FROM flavors WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        console.log(response)
        res.sendStatus(204)
        
    } catch (error) {
        next(error)
    }
})


//Error handler area  *************************************** 
app.use((error,req,res,next) => {
    res.status(500)
    res.send(error)
})


app.use('*', (req,res,next) => {
    res.send("No such route exists")
})


// Main SQL area  ************************************
// run npm run start:dev to reset data to original form if everything has been deleted in browser or postman

const start = async () => {
    await client.connect()
    console.log("connected to db!")

    const SQL = `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors(
        id SERIAL PRIMARY KEY,
        name VARCHAR(25),
        is_favorite BOOLEAN
    );

    INSERT INTO flavors(name, is_favorite) VALUES ('Chocolate', true);
    INSERT INTO flavors(name) VALUES ('Vanilla');
    INSERT INTO flavors(name, is_favorite) VALUES ('Caramel', true);
    INSERT INTO flavors(name) VALUES ('DoubleChocolate');
    INSERT INTO flavors(name) VALUES ('Mint');
    INSERT INTO flavors(name) VALUES ('Cherry');
    INSERT INTO flavors(name) VALUES ('Coconut');
    INSERT INTO flavors(name) VALUES ('BananaSplit');
    INSERT INTO flavors(name, is_favorite) VALUES ('FudgeBrowny', true);
    `
    await client.query(SQL)
    console.log("table created and seeded")

    const port = process.env.PORT || 3001
    

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })


}

start()