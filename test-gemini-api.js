// Test script to verify Gemini API functionality
const API_KEY = 'AIzaSyAh1B2ymTz900dfjHJ-ODzRIcSj7U588RI'; // Using the key from your .env
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

async function testGeminiAPI() {
    console.log('Testing Gemini API...');
    
    try {
        const requestBody = {
            contents: [{
                parts: [{
                    text: "Hello, this is a test message to check if the API key is working. Please respond with a simple greeting."
                }]
            }]
        };

        console.log('Making request to:', API_URL);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            return;
        }
        
        const data = await response.json();
        console.log('API Response received successfully!');
        console.log('Response data type:', typeof data);
        
        if (data.candidates && data.candidates[0]) {
            const responseText = data.candidates[0].content.parts[0].text;
            console.log('Gemini response:', responseText);
        } else {
            console.log('Unexpected response format:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('Network error or API call failed:', error.message);
    }
}

testGeminiAPI();