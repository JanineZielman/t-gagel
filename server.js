const https = require('https');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = 3000;

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certificates', 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificates', 'localhost.pem'))
};

app.prepare()
  .then(() => {
    // Create HTTPS server
    const server = https.createServer(sslOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    // Add error handling
    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });

    // Start server
    server.listen(port, (err) => {
      if (err) {
        console.error('Error starting server:', err);
        return;
      }
    });
  })
  .catch((err) => {
    console.error('Error during app preparation:', err);
    process.exit(1);
  });

