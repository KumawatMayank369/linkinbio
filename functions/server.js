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

// 1. PUBLIC PAGE WITH BUILT-IN STYLING
app.get('/', (req, res) => {
    let buttonsHtml = links.map(link => `
        <a href="/click/${link.id}" target="_blank" class="link-button">
            ${link.title}
        </a>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>My Links</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    background-color: #f8fafc;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                }
                .profile-container {
                    text-align: center;
                    margin-bottom: 32px;
                    max-width: 400px;
                }
                .avatar {
                    width: 96px;
                    height: 96px;
                    background-color: #4f46e5;
                    color: white;
                    border-radius: 50%;
                    margin: 0 auto 16px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    font-weight: bold;
                    box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
                }
                h1 { color: #0f172a; font-size: 24px; font-weight: 700; }
                p { color: #64748b; font-size: 16px; margin-top: 4px; }
                .links-wrapper {
                    width: 100%;
                    max-width: 400px;
                }
                .link-button {
                    display: block;
                    width: 100%;
                    background-color: white;
                    color: #1e293b;
                    text-align: center;
                    text-decoration: none;
                    font-weight: 600;
                    padding: 16px;
                    margin-bottom: 16px;
                    border-radius: 12px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .link-button:hover {
                    transform: scale(1.03);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
            </style>
        </head>
        <body>
            <div class="profile-container">
                <div class="avatar">ME</div>
                <h1>Welcome to My Page</h1>
                <p>Check out my projects and social channels below!</p>
            </div>
            <div class="links-wrapper">
                ${buttonsHtml}
            </div>
        </body>
        </html>
    `);
});

// 2. TRACK CLICK & REDIRECT
app.get('/click/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const link = links.find(l => l.id === id);
    if (link) {
        link.clicks += 1;
        return res.redirect(link.url);
    }
    res.status(404).send('Link not found');
});

// 3. ADMIN DASHBOARD WITH BUILT-IN STYLING
app.get('/admin', (req, res) => {
    let rowsHtml = links.map(link => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 16px; font-weight: 500; color: #1e293b;">${link.title}</td>
            <td style="padding: 16px; color: #64748b; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${link.url}</td>
            <td style="padding: 16px; text-align: center; font-weight: 700; color: #4f46e5;">${link.clicks}</td>
        </tr>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Dashboard</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    background-color: #f1f5f9;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    padding: 24px;
                }
                .dashboard-card {
                    max-width: 800px;
                    margin: 32px auto 0 auto;
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                h1 { font-size: 24px; color: #0f172a; }
                p { font-size: 14px; color: #64748b; }
                .btn {
                    background-color: #4f46e5;
                    color: white;
                    text-decoration: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                }
                table { width: 100%; border-collapse: collapse; text-align: left; }
                th { background-color: #f8fafc; padding: 12px 16px; color: #475569; font-size: 14px; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
            </style>
        </head>
        <body>
            <div class="dashboard-card">
                <div class="header-flex">
                    <div>
                        <h1>Analytics Dashboard</h1>
                        <p>Track how many times your links have been clicked</p>
                    </div>
                    <a href="/" class="btn">View Public Page</a>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Link Title</th>
                            <th>Destination URL</th>
                            <th style="text-align: center;">Total Clicks</th>
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
