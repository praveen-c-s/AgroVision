// Basic test without any imports
console.log('BasicTest: Starting...');

const testDiv = document.createElement('div');
testDiv.innerHTML = '<h1>Basic JavaScript Test</h1><p>If you see this, JavaScript is working</p>';
document.body.appendChild(testDiv);

console.log('BasicTest: DOM element added');
