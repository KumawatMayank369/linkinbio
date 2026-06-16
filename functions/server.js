const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.use(express.json());

// Hardcoded data directly in code so it works flawlessly in a serverless environment
let links = [
  { "id": 1, "title": "My GitHub Profile", "url": "https://github.com", "clicks": 0 },
  { "id": 2, "title": "Follow my Twitter / X", "url": "https://twitter.com", "clicks": 0 },
  { "id": 3, "title": "Check out my Portfolio", "url": "https://example.com", "clicks": 0 }
];

// 1. PUBLIC PAGE
app.get('/', (req, res) => {
    let buttonsHtml = links.map(link => `
        <a href="/click/${link.id}" target="_blank" class="w-full max-w-md block bg-white text-gray-800 text-center font-semibold py-4 px-6 mb-4 rounded-xl shadow-md border border-gray-100 hover:scale-105 transition-transform">
            ${link.title}
        </a>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>My Links</title>
            <script src="https://jsdelivr.net"></script>
        </head>
        <body class="bg-slate-50 min-h-screen flex flex-col items-center justify-center p-6">
            <div class="w-full max-w-md text-center mb-8">
                <div class="w-24 h-24 bg-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">ME</div>
                <h1 class="text-2xl font-bold text-gray-900">Welcome to My Page</h1>
                <p class="text-gray-500 mt-1">Check out my projects and social channels below!</p>
            </div>
            <div class="w-full max-w-md">${buttonsHtml}</div>
        </body>
        </html>
    `);
});

// 2. TRACK CLICK & REDIRECT
app.get('/click/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const link = links.find(l => l.id === id);
    if (link) {
        link.clicks += 1; // Tracks clicks during active runtime sessions
        return res.redirect(link.url);
    }
    res.status(404).send('Link not found');
});

// 3. ADMIN DASHBOARD
app.get('/admin', (req, res) => {
    let rowsHtml = links.map(link => `
        <tr class="border-b border-gray-100">
            <td class="py-4 px-4 font-medium text-gray-800">${link.title}</td>
            <td class="py-4 px-4 text-gray-500">${link.url}</td>
            <td class="py-4 px-4 text-center font-bold text-indigo-600">${link.clicks}</td>
        </tr>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Dashboard</title>
            <script src="https://jsdelivr.net"></script>
        </head>
        <body class="bg-gray-100 min-h-screen p-6">
            <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 mt-8">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <a href="/" class="bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg text-sm">View Public Page</a>
                </div>
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 text-gray-600 text-sm font-semibold">
                            <th class="py-3 px-4">Link Title</th><th class="py-3 px-4">Destination URL</th><th class="py-3 px-4 text-center">Total Clicks</th>
                        </tr>
                    </thead>
                    <tbody>${rowsHtml}</tbody>
                </table>
            </div>
        </body>
        </html>
    `);
});

module.exports.handler = serverless(app);
