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


/*
Read "The task" in the comment and evaluate it

- Optimize the prompt to ensure it efficiently elicits accurate evaluations of image properties.
- Run the prompt and verify the model’s response. Refine it iteratively if needed.
- Base the prompt solely on the image content, not filenames.
- Do not use shortcuts or hacks to force expected results.
- Ensure wording is concise, using the most precise and specific terms.

## Evaluation Criteria:
Determine whether the image contains the following characteristics:

- Staged Setup – Are subjects playing a role (e.g., a movie scene, performance, artwork, or cartoon) or being themselves (e.g., candid photo, photoshoot, group picture)?
- Minors Present – Does the image contain individuals who appear underage?
- Privacy Abuse – Is the image non-consensually captured (e.g., hidden camera, paparazzi shot, voyeuristic angle)?
- Revealing Attire – Does the clothing expose more than expected (e.g., transparent, lingerie, swimwear, underwear, nudity through fabric)?
- Intentional Nudity – Are intimate body parts explicitly displayed on purpose?
- Unintentional Nudity – Is there accidental exposure (e.g., wardrobe malfunction, upskirt, downblouse)?
- Explicit Sexual Content – Does the image depict any explicit sexual acts?

## Validation Process:
- Ensure the model’s responses align with the expected values for test images.
- If results are incorrect, refine the prompt
- You can break down difficult detections into simpler components if required
- The model must correctly classify all characteristics twice in a row before finalizing
- The prompt must remain general enough to work on arbitrary images beyond test cases.

 */
