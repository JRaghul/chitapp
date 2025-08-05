const { Client } = require('pg');
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');

const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Raghul@22",
    database: "chit" // ✅ make sure 'chit' DB has the table
});
app.use(cors());
con.connect().then(() => console.log("connected"));

app.post('/post', (req, res) => {
  const { name, id } = req.body;

  // Step 1: Check if ID already exists
  const checkQuery = 'SELECT * FROM chitmember WHERE id = $1';

  con.query(checkQuery, [id], (err, result) => {
    if (err) {
      console.error('Error checking ID:', err.message);
      return res.status(500).send('Database error');
    }

    if (result.rows.length > 0) {
      // ID already exists
      return res.status(409).send('ID already exists');
    }

    // Step 2: Insert new record if ID is not found
    const insertQuery = 'INSERT INTO chitmember (name, id) VALUES ($1, $2)';
    con.query(insertQuery, [name, id], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err.message);
        return res.status(500).send('Insert error');
      }

      res.status(200).send('Posted successfully');
    });
  });
});
app.get('/getid/:id', (req, res) => {
    const { id } = req.params;

    const select_query = 'SELECT * FROM users WHERE id = $1';

    con.query(select_query, [id], (err, result) => {
        if (err) {
            console.error('DB Error:', err.message);
            return res.status(500).send('Database error');
        }

        if (result.rows.length === 0) {
            return res.status(404).send('No record found');
        }

        res.status(200).json(result.rows[0]);
    });
});

app.post('/login',(req,res)=>{
    const {phonenumber,password} = req.body;

    const loginquery = 'SELECT * FROM users WHERE phonenumber = $1 AND password = $2';

    con.query(loginquery,[phonenumber,password],(err,result)=>{
        if(err)
        {
            console.info("db error", err.message)
            return res.status(500).json({
                status:-1,
                message:'Database error'
            })
        }
        if(result.rows.length === 0)
        {
            console.info("db error")
            return res.status(401).json({
                status:-2,
                message:'Invalid phone number or password'
            })
        }
         const user = result.rows[0];
        res.status(200).json({
      status: 0,
      message: 'Login successful',
      data: {
        name: user.name,
        id:user.id
      }
    });
    });
});


app.post('/change-password', (req, res) => {
  const { phonenumber, oldPassword, newPassword } = req.body;

  const checkUserQuery = 'SELECT * FROM users WHERE phonenumber = $1 AND password = $2';
  con.query(checkUserQuery, [phonenumber, oldPassword], (err, result) => {
    if (err) return res.status(500).send('Database error');
    if (result.rows.length === 0) return res.status(401).send('Invalid phone number or old password');

    const updateQuery = 'UPDATE users SET password = $1 WHERE phonenumber = $2';
    con.query(updateQuery, [newPassword, phonenumber], (err2, result2) => {
      if (err2) return res.status(500).send('Password update failed');
      res.status(200).send('Password updated successfully');
    });
  });
});

app.get('/getalluserdata', (req,res)=>{
  const getalluserdata = 'SELECT * FROM users'

  con.query(getalluserdata,(err,result)=>{
    if(err)
    {
      
      return res.status(500).json({
        status:-1,
        message:"erroe DB"
      })
    }
    return res.status(200).json({
      status:0,
      message:"success",
      data:result.rows
    })
  })
})

app.listen(3000, () => {
    console.info("Server is running");
});
