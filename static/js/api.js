// API Service for Emotion Detection
const API = {
    baseURL: '',
    
    // Headers for JSON requests
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },

    // Predict single text
    async predict(text) {
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ text })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Prediction error:', error);
            throw error;
        }
    },

    // Batch predict multiple texts
    async batchPredict(texts) {
        try {
            const response = await fetch('/batch_predict', {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ texts })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Batch prediction error:', error);
            throw error;
        }
    },

    // Get available emotions
    async getEmotions() {
        try {
            const response = await fetch('/emotions');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Get emotions error:', error);
            throw error;
        }
    },

    // Health check
    async healthCheck() {
        try {
            const response = await fetch('/health');
            return await response.json();
        } catch (error) {
            console.error('Health check error:', error);
            throw error;
        }
    }
};

// Emotion colors for consistent theming
const EmotionColors = {
    'joy': '#FFD700',
    'sadness': '#4169E1',
    'anger': '#DC143C',
    'fear': '#800080',
    'love': '#FF69B4',
    'surprise': '#FFA500'
};

// Emotion icons
const EmotionIcons = {
    'joy': '😊',
    'sadness': '😢',
    'anger': '😠',
    'fear': '😨',
    'love': '😍',
    'surprise': '😲'
};

// Export for use in other files
window.API = API;
window.EmotionColors = EmotionColors;
window.EmotionIcons = EmotionIcons;