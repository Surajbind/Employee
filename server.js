let connection;
var oracledb = require('oracledb');
var express = require('express');
const json2csv = require('json2csv');
const fs = require('fs');
var app = express();
const PORT = process.env.PORT || 8901;

app.use(express.json())


const con = async function () {
  try {
    connection = await oracledb.getConnection({
      user: 'IDEALFUNDTEST',
      password: 'IDEALFUNDTEST',
      connectString: 'fundsdb19c.chwkrfaqj9m1.ap-south-1.rds.amazonaws.com:1521/wforcl'
    });
    console.log("Successfully connected to Oracle!")
  } catch (err) {
    console.log("Error: ", err);
  }
}();

//Insertion
app.post('/post', (req, res) => {
  try {
    result = connection.execute(`INSERT INTO TestEmployees VALUES (:ID, :NAME, :EMAIL)`,
      [req.body.ID, req.body.NAME, req.body.EMAIL],
      { autoCommit: true });
    res.send("Data inserted successfully");
  }
  catch (e) {
    console.log(e);
  }
});

//Selection
app.get('/get', (req, res) => {
  try {
    connection.execute(
      `select * from  TestEmployees`,
      [],
      function (err, result) {
        if (err) {
          console.error(err.message);
          return;
        }
        var data = JSON.parse(JSON.stringify(result.rows));
        for (var i = 0; i < data.length; i++) {
          console.log(data[i]);
        }

        if (result.rows.length == 0) {
          console.log("data Present  in Database");
          res.send("No data Present in Database");
        }
        else {
          res.send(result.rows);
        }
      });
  }
  catch (e) {
    console.log(e);
  }

});

//Selection via Id
app.get('/getid/:ID', (req, res) => {
  try {
    var checkid = req.params.ID;
    result = connection.execute(`select * from TestEmployees where id = :ID`, [checkid],
      function (err, result) {
        if (err) {
          console.error(err.message);
          return;
        }
        if (result.rows.length == 0) {
          console.log("Id Not Present  in Database");
          res.send("Id Not Present in Database");
        }
        else {
          console.log(JSON.parse(JSON.stringify(result.rows)));
          res.send(result.rows);
        }
      });
  }
  catch (e) {
    console.log(e);
  }
});

//Updation
app.put('/put/:ID', (req, res) => {
  try {
    result = connection.execute(`UPDATE TestEmployees set name = :NAME, email = :EMAIL where id = ${req.params.ID}`,
      [req.body.NAME, req.body.EMAIL],
      { autoCommit: true },
      function (err, result) {
        if (err) {
          console.error('error message is \n' + err.message);
          return;
        }
        console.log(`Updated Successfully`);
        res.send(`Updated Successfully`);
      });
  }
  catch (e) {
    console.log('Error Occured' + e);
  }
})

//Deletion
app.delete('/delete/:ID', (req, res) => {
  try {
    result = connection.execute(`DELETE TestEmployees where id = :ID`, [req.params.ID],
      { autoCommit: true },
      function (err, result) {
        if (err) {
          console.error('error message is \n' + err.message);
          return;
        }
        console.log(`Deleted Successfully`);
        res.send(`Deleted Successfully`);
      });
  }
  catch (e) {
    console.log(e);
  }

});

app.get('/generate/csv', (req, res) => {
  try {
    connection.execute(
      `select * from  TestEmployees`,
      [],
      function (err, result) {
        if (err) {
          console.error(err.message);
          return;
        }
        // var data = {datas : result.rows};
        var data = {value:""};
        for(var i=0;i<result.rows.length;i++){
          data.value = data.value +" , "+ result.rows[i];
        }
        console.log(data);
        res.send(result.rows);
      });
  }
  catch (e) {
    console.log(e);
  }

});

app.listen(PORT, (err, res) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(`Server started on port ` + PORT);
  }
})