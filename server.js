// Step 1: Setup Project
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
})


// Step 2: Database Setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT)');
});

// Step 3: User Registration
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash], (err) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to register user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Step 4: User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }

    bcrypt.compare(password, row.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ error: 'Authentication failed' });
      }

      const token = jwt.sign({ id: row.id, username: row.username }, 'secret', { expiresIn: '1h' });

      res.json({ token });
    });
  });
});

// Step 5: Middleware for JWT Verification
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'Token not provided' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
};

// Example protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Step 6: Fetch Data from Public API
const fetchData = async () => {
  try {
    const response = await axios.get('https://api.publicapis.org/entries');
    return response.data.entries;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Step 7: Implement Filtering
const filterData = (data, category, limit) => {
  let filteredData = data;

  if (category) {
    filteredData = filteredData.filter(entry => entry.Category.toLowerCase() === category.toLowerCase());
  }

  if (limit) {
    filteredData = filteredData.slice(0, limit);
  }

  return filteredData;
};

// Step 8: API Endpoint for Data Retrieval
app.get('/api/data', async (req, res) => {
  try {
    const { category, limit } = req.query;
    const data = await fetchData();
    const filteredData = filterData(data, category, limit);
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Step 9: Serve Swagger UI
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Step 10: Error handling for invalid routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
