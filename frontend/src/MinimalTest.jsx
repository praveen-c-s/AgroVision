// Minimal test - no imports, no dependencies
console.log('=== MINIMAL TEST START ===');

// Test 1: Basic DOM manipulation
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');
  
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial;">
      <h1 style="color: #10b981; margin-bottom: 20px;">🌾 MINIMAL TEST</h1>
      <p style="font-size: 18px; color: #059669;">If you can see this, JavaScript is working!</p>
      <p style="font-size: 16px; color: #6b7280;">Time: ${new Date().toLocaleTimeString()}</p>
      <button onclick="alert('Button clicked!')" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Test JavaScript
      </button>
    </div>
  `;
  
  document.body.appendChild(testDiv);
  console.log('Test element added to body');
});

// Test 2: Check for React
setTimeout(() => {
  const root = document.getElementById('root');
  if (root) {
    console.log('Root element found:', root);
    root.innerHTML = '<div style="padding: 50px; text-align: center;"><h2>REACT ROOT FOUND</h2><p>React should render here</p></div>';
  } else {
    console.error('Root element not found!');
  }
}, 1000);

console.log('=== MINIMAL TEST SETUP COMPLETE ===');
