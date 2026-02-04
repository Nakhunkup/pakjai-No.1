const fetch = require('node-fetch');
const apiKey = 'AIzaSyCkGYDAoqZuUxdfRzASuYjAiCYL13a0_yg';
console.log("Checking models for key:", apiKey);
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error("API Error:", data.error);
        } else {
            console.log("Available Models:");
            (data.models || []).forEach(m => console.log(m.name));
        }
    })
    .catch(err => console.error("Fetch Error:", err));
