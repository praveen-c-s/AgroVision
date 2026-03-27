# 🌱 AgroVision – Smart Agricultural Support System

AgroVision is an AI-powered agricultural assistance platform designed to help farmers make better decisions using crop disease detection, pest analysis, and soil-based crop recommendations.

---

## 🚀 Features

### 👨‍🌾 Farmer Module

* Upload plant images for disease detection
* Select symptoms for better accuracy
* Request soil testing services
* View AI-generated reports and recommendations

### 🧑‍🔬 Officer Module

* View and process farmer requests
* Perform AI-based analysis
* Generate final advisory reports
* Provide multilingual advisory (English & Malayalam)
* Voice-based advisory reading

### 🧠 AI Modules

* Plant Disease Detection (CNN Model)
* Pest Detection (TensorFlow Model)
* Crop Recommendation (ML Model based on soil parameters)
* Fertilizer Recommendation System
* AI Explanation System

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend

* Flask (Python)
* REST APIs

### Machine Learning

* TensorFlow / Keras (Image Models)
* Scikit-learn (Crop Recommendation)
* Joblib (Model Loading)

---

## 📊 System Workflow

1. Farmer submits request (image / soil data)
2. AI processes input using ML models
3. Officer reviews AI result
4. Final advisory generated
5. Farmer views report + voice output

---

## 🔊 Special Features

* 🌐 Malayalam Advisory Translation
* 🔈 Voice Output using SpeechSynthesis API
* 📄 PDF Report Generation
* 📊 AI Explanation for transparency

---

## 📁 Project Structure

```
AgroVision/
│
├── backend/        # Flask backend + APIs
├── frontend/       # React frontend
├── ml/             # Machine learning models
└── README.md
```

---

## ⚠️ Note

Large ML model files are included. For production, use:

* Git LFS OR
* External model hosting

---

## 👨‍💻 Author

**Praveen C S**

---

## 📌 Status

✅ Completed
✅ Ready for Demo / Viva
🚀 Future Scope: Mobile app, IoT integration, real-time weather data
