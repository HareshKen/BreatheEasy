# BreatheEasy – Predictive Monitoring for Chronic Respiratory Disease

## Description
BreatheEasy is an AI-powered mobile application that provides early warnings for patients with chronic respiratory diseases like COPD and Asthma.  

Instead of reacting only when severe symptoms occur, BreatheEasy enables proactive management by monitoring and predicting risks.  

### Key Features
- **Acoustic Monitoring**  
  Uses the phone’s microphone (with permission) to detect:
  - Nocturnal cough frequency  
  - Wheezing sounds  
  - Changes in breathing rate  

- **Predictive Risk Modeling**  
  Combines multiple data streams to generate a daily *Exacerbation Risk Score*:  
  - Real-time Air Quality Index (AQI) and pollen data  
  - User-logged inputs like inhaler usage and symptoms  
  - Time-series analysis using LSTM models  

### Impact
By anticipating early signs of exacerbations, BreatheEasy helps prevent emergency visits and hospitalizations, especially in areas with poor air quality such as Tamil Nadu.  

---

## Setup Instructions

1. Clone the repository:  
   ```bash
   cd BreatheEasy
   git clone <your-repo-url>
   ```
2. Install dependencies:
    ```bash
   npm install
   ```
3. Fix any vulnerabilities (when prompted):
   ```bash
   npm audit fix --force
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the local server link shown in the terminal.
6. When prompted by your browser, allow microphone and location permissions for full functionality.


   
