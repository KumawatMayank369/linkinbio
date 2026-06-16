const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.use(express.json());

// --- MACHINE LEARNING MODEL LOGIC ---
// Our trained model weights (Slope and Intercept)
// Equation: Price = (SqFt * 150) + (Bedrooms * 25000) + 50000
const predictHousePrice = (sqft, bedrooms) => {
    const basePrice = 50000;
    const sqftPrice = sqft * 150;
    const bedroomPrice = bedrooms * 25000;
    return basePrice + sqftPrice + bedroomPrice;
};

// 1. ML WEB INTERFACE PAGE
app.get('/ml', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ML House Price Predictor</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    background-color: #f1f5f9;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    padding: 20px;
                }
                .card {
                    background: white;
                    padding: 32px;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 450px;
                }
                h1 { color: #1e293b; font-size: 24px; margin-bottom: 8px; text-align: center; }
                p { color: #64748b; font-size: 14px; margin-bottom: 24px; text-align: center; }
                .form-group { margin-bottom: 16px; }
                label { display: block; font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 6px; }
                input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px; }
                button {
                    width: 100%;
                    background-color: #2563eb;
                    color: white;
                    padding: 14px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 8px;
                }
                button:hover { background-color: #1d4ed8; }
                .result-box {
                    margin-top: 24px;
                    padding: 16px;
                    background-color: #f8fafc;
                    border-radius: 8px;
                    border: 1px dashed #cbd5e1;
                    text-align: center;
                    display: none;
                }
                .result-price { font-size: 24px; font-weight: 700; color: #16a34a; margin-top: 4px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>House Price Predictor</h1>
                <p>AI Machine Learning Deployment Model</p>
                
                <div class="form-group">
                    <label for="sqft">Square Footage (Sq Ft)</label>
                    <input type="number" id="sqft" placeholder="e.g. 1500" value="1200">
                </div>
                
                <div class="form-group">
                    <label for="rooms">Number of Bedrooms</label>
                    <input type="number" id="rooms" placeholder="e.g. 3" value="3">
                </div>
                
                <button onclick="getPrediction()">Predict Live Price</button>
                
                <div class="result-box" id="resultBox">
                    <div style="font-size: 14px; color: #475569;">Estimated Market Value</div>
                    <div class="result-price" id="priceText">$0</div>
                </div>
            </div>

            <script>
                async function getPrediction() {
                    const sqft = document.getElementById('sqft').value;
                    const rooms = document.getElementById('rooms').value;
                    
                    const response = await fetch('/predict', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sqft: parseInt(sqft), bedrooms: parseInt(rooms) })
                    });
                    
                    const data = await response.json();
                    
                    document.getElementById('resultBox').style.display = 'block';
                    document.getElementById('priceText').innerText = '$' + data.predicted_price.toLocaleString();
                }
            </script>
        </body>
        </html>
    `);
});

// 2. ML API ENDPOINT (Handles JSON prediction data)
app.post('/predict', (req, res) => {
    const { sqft, bedrooms } = req.body;

    if (!sqft || !bedrooms) {
        return res.status(400).json({ error: 'Please provide both sqft and bedrooms' });
    }

    const price = predictHousePrice(sqft, bedrooms);

    // Send back the prediction as an API response
    res.json({
        input_data: { sqft, bedrooms },
        predicted_price: price,
        model_type: "Linear Regression"
    });
});

// Fallback to preserve your older link bio homepage if you want to visit /
app.get('/', (req, res) => {
    res.redirect('/ml');
});

module.exports.handler = serverless(app);
