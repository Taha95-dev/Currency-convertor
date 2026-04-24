const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const resultDiv = document.getElementById('result');
const lastUpdatedDiv = document.getElementById('lastUpdated');
const swapBtn = document.getElementById('swapBtn');

// Free API (no API key needed for demo rates)
// Using ExchangeRate-API's free endpoint
const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

// Fetch and convert
async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    // Validation
    if (isNaN(amount) || amount <= 0) {
        resultDiv.innerHTML = '❌ Please enter a valid amount';
        return;
    }

    // Show loading state
    resultDiv.innerHTML = '🔄 Fetching live rates...';
    convertBtn.disabled = true;
    convertBtn.classList.add('loading');

    try {
        const response = await fetch(`${API_URL}${from}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        const rate = data.rates[to];
        const convertedAmount = (amount * rate).toFixed(2);
        
        // Display result with formatting
        resultDiv.innerHTML = `
            ${amount} ${from} = 
            <span style="color: #667eea; font-size: 32px;">${convertedAmount} ${to}</span>
        `;
        
        // Show rate info
        const ratePerUnit = rate.toFixed(4);
        resultDiv.innerHTML += `<div style="font-size: 14px; margin-top: 8px;">1 ${from} = ${ratePerUnit} ${to}</div>`;
        
        // Show when rates were last updated
        const lastUpdate = new Date(data.date);
        lastUpdatedDiv.innerHTML = `Rates updated: ${lastUpdate.toLocaleString()}`;
        
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '⚠️ Unable to fetch rates. Please try again.';
        lastUpdatedDiv.innerHTML = '';
    } finally {
        convertBtn.disabled = false;
        convertBtn.classList.remove('loading');
    }
}

// Swap currencies
function swapCurrencies() {
    const fromValue = fromCurrency.value;
    const toValue = toCurrency.value;
    fromCurrency.value = toValue;
    toCurrency.value = fromValue;
    convertCurrency(); // auto-convert after swap
}

// Convert on button click
convertBtn.addEventListener('click', convertCurrency);

// Convert on Enter key
amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') convertCurrency();
});

// Swap button
swapBtn.addEventListener('click', swapCurrencies);

// Auto-convert when currencies change
fromCurrency.addEventListener('change', convertCurrency);
toCurrency.addEventListener('change', convertCurrency);
amountInput.addEventListener('input', convertCurrency);

// Initial conversion on page load
convertCurrency();