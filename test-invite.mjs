import http from 'http';

const req = http.request(
  {
    hostname: 'localhost',
    port: 3000,
    path: '/api/apps/default/invite',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
  (res) => {
    let data = '';
    res.on('data', (c) => (data += c));
    res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', data));
  }
);
req.on('error', (e) => console.log('ERROR:', e.message));
req.write(JSON.stringify({ email: 'test@example.com' }));
req.end();
