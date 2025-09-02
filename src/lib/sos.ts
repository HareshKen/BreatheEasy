
import type { SymptomLog } from './types';

interface EmergencyAlertData {
  riskScore: number;
  symptomLogs: SymptomLog[];
}

// Helper to get location
const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Could not get location: ${error.message}`));
      }
    );
  });
};

/**
 * Simulates sending an emergency alert.
 * In a real application, this would call a backend service to send an SMS or email.
 */
export const sendEmergencyAlert = async (data: EmergencyAlertData): Promise<string> => {
  try {
    const { latitude, longitude } = await getCurrentLocation();
    
    const lastSymptom = data.symptomLogs.length > 0 ? data.symptomLogs[data.symptomLogs.length - 1] : null;

    let message = `
      EMERGENCY ALERT from BreatheEasy App:
      
      A user may require immediate assistance.
      
      - Current Risk Score: ${data.riskScore}/100
      - Location: https://www.google.com/maps?q=${latitude},${longitude}
      
      Last Reported Vitals:
      - Phlegm Color: ${lastSymptom?.phlegmColor || 'N/A'}
      - Inhaler Usage (Today): ${lastSymptom?.inhalerUsage || 'N/A'}
      - Triggers: ${lastSymptom?.triggers.join(', ') || 'N/A'}
    `.trim().replace(/^\s+/gm, '');

    // --- MOCK API CALL ---
    console.log("--- SIMULATING EMERGENCY ALERT ---");
    console.log(message);
    console.log("This message would be sent to pre-configured emergency contacts and healthcare providers.");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // --- END MOCK ---

    return "Successfully sent emergency alert to pre-configured contacts.";

  } catch (error) {
    console.error("SOS Error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to send alert: ${error.message}`);
    }
    throw new Error("An unknown error occurred while sending the alert.");
  }
};
