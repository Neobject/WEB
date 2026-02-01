const axios = require('axios');

// Hugging Face sentiment analysis
async function getSentiment(text) {
    const model = 'finiteautomata/bertweet-base-sentiment-analysis';
    const url = `https://router.huggingface.co/hf-inference/models/${model}`;

    try {
        const response = await axios.post(
            url,
            { inputs: text },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        const apiError = error.response?.data;
        throw new Error(apiError?.error || 'HF request failed');
    }
}

// OpenAI chat
async function askAI(prompt) {
    const apiKey = process.env.OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await axios.post(
            url,
            {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        throw new Error(
            error.response?.data?.error?.message || 'OpenAI request failed'
        );
    }
}

module.exports = {
    getSentiment,
    askAI
};
