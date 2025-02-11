const fs = require('fs').promises;
const path = require('path');

async function getPromptResponse(image) {
    console.log('Analyzing ', image)

    const imagePath = path.join(__dirname, image);
    const promptPath = path.join(__dirname, 'prompt.txt');
    
    const [imageBuffer, promptText] = await Promise.all([
        fs.readFile(imagePath),
        fs.readFile(promptPath, 'utf-8')
    ]);
    
    const base64Image = imageBuffer.toString('base64');

    const response = await fetch('http://192.168.178.96:1234/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "minicpm-v-2_6",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        },
                        {
                            type: "text",
                            text: promptText
                        }
                    ]
                }
            ],
            temperature: 0,
            max_tokens: 1024
        })
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

(async () => {
    await getPromptResponse('images/shining.jpg').then(console.log)
    await getPromptResponse('images/paparazzi.webp').then(console.log)
    await getPromptResponse('images/ns.jpg').then(console.log)
    await getPromptResponse('images/simple.jpg').then(console.log)
    await getPromptResponse('images/bus.jpg').then(console.log)
})();
