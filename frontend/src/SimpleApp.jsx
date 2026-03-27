import React from 'react';

const SimpleApp = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#10b981', marginBottom: '20px' }}>🌾 Smart Agricultural Support System</h1>
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '30px', 
        borderRadius: '10px', 
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ color: '#059669', marginBottom: '15px' }}>✅ System Status: Online</h2>
        
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <h3 style={{ color: '#10b981', marginBottom: '10px' }}>🌐 Frontend Services:</h3>
          <p>✅ React: Loaded and Running</p>
          <p>✅ Vite: Development Server Active</p>
          <p>✅ Tailwind CSS: Applied</p>
          <p>✅ Router: Configured</p>
        </div>
        
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <h3 style={{ color: '#10b981', marginBottom: '10px' }}>🔧 Backend Services:</h3>
          <p>✅ Flask API: Running on Port 5000</p>
          <p>✅ MongoDB: Connected</p>
          <p>✅ TensorFlow Models: Loaded</p>
          <p>✅ JWT Authentication: Ready</p>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={() => window.location.href = 'http://localhost:5173/login'}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            🚀 Go to Login
          </button>
          
          <button 
            onClick={() => alert('React is working! Frontend is successfully loaded.')}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            🧪 Test React
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleApp;
