/**
 * EmotionAI - Analyzer Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Only run if on analyzer page
    const textInput = document.getElementById('textInput');
    if (!textInput) return;

    // 1. Character Count
    textInput.addEventListener('input', () => {
        const text = textInput.value;
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

        document.getElementById('charCount').textContent = charCount;
        document.getElementById('wordCount').textContent = wordCount;
    });

    // 2. Clear Button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            textInput.value = '';
            textInput.dispatchEvent(new Event('input')); // Update counts
            const resultsCard = document.getElementById('resultsCard');
            if (resultsCard) {
                resultsCard.style.display = 'none';
            }
        });
    }

    // 3. Sample Button
    const sampleBtn = document.getElementById('sampleBtn');
    if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
            const samples = [
                "I'm absolutely thrilled with this amazing news! Today is the best day ever!",
                "I feel so heartbroken and alone right now, nothing seems to go right.",
                "This is completely unacceptable! I'm furious about how this was handled.",
                "I'm really nervous about tomorrow's presentation, what if I mess up?",
                "You mean so much to me, I can't imagine my life without you.",
                "Wow! I never expected this, what a wonderful surprise!"
            ];
            const randomSample = samples[Math.floor(Math.random() * samples.length)];
            textInput.value = randomSample;
            textInput.dispatchEvent(new Event('input')); // Update counts
        });
    }

    // Initialize counts on load (if text exists)
    if (textInput.value) {
        textInput.dispatchEvent(new Event('input'));
    }
});
