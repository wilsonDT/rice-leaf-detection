// Test script to directly check the Hugging Face API
require('dotenv').config({ path: '.env.local' });

const token = process.env.HF_TOKEN;
if (!token) {
  console.error("No HF_TOKEN found in environment variables");
  process.exit(1);
}

console.log("Token available:", !!token);
console.log("Token prefix:", token.substring(0, 5) + "..." + token.substring(token.length - 3));

// Test endpoint
const apiUrl = "https://api-inference.huggingface.co/models/wilsondt/rice-disease-classification";

// Simple test request to check if the model exists
fetch(apiUrl, {
  method: "HEAD",
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
.then(response => {
  console.log("Status:", response.status, response.statusText);
  console.log("Headers:", Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    console.error("API error:", response.status, response.statusText);
  } else {
    console.log("API endpoint is accessible!");
  }
})
.catch(error => {
  console.error("Fetch error:", error);
}); 