//setting up the database connection
const express = require('express');
const mysql = require('mysql2');
const app = express();
const pool = mysql.createPool({
  host: 'port-name',
  user: 'user-name',
  password: 'password',
  database: 'db-name',
//appending request and recieve onto the document - function is to read the colomns and fows of a db and put them into a table.
}).promise();

app.get('/', async (req, res) => { 
  try {
    const [rows] = await pool.query('SELECT id, Firstname, Lastname, Address FROM users');
    res.send(`
      <style>
      table { border-collapse: collapse; width: 100%;}
      th, td { border: 1px solid black; padding: 8px; text-align: left;}
      th { background-color: #f2f2f2; }
      </style>
      <table>
        <tr>
          <th>ID</th>
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Address</th>
        </tr>
        ${rows.map(user => `
        <tr>
          <td>${user.id || ''}</td>
          <td>${user.Firstname || ''}</td>
          <td>${user.Lastname || ''}</td>
          <td>${user.Address || ''}</td>
        </tr>
        `).join('')}
      </table>
    `);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error retrieving users');
  }
});
// function for sorting through each port until there is a valid connection
function startServer(port) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use, trying ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}
//initial port access
startServer(10476);