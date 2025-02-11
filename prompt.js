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

Ensure that the prompt is efficient and produces expected results.
Run the prompt and check the response.
Only base the prompt on the image contents, not the filename.
Don't do hacks or shortcuts to reach your goal.
If the response is not as expected, improve the prompt and try again until it is.
Prompt should use wording that is clear and concise, and should be as short as possible, choose most specific words and coined terms that most accurately describe exact properties or actions that are being evaluated.

You can prompt the model with a prompt of your choosing to get specific knowledge about certain details of the image, which might be relevant to come up with a better prompt.

Characteristics to be detected by vision model:
    - 1: wether the photo depicts real-life characters and setting (who they really are) not a staged role-play setting (movie, acting, art etc)
    - 2: wether the photo contains minors (underage people)
    - 3: wether the photo captures the process of nonconcensual privacy abuse (nonconcensual capture, hidden cam, paparazzi shot, voyeur vibes, etc)
    - 4: wether the photo contains attire that reveals a bit more (or much more) than it probably should (transparent, bikini, lingerie, underwear, private parts showing through, complete lack of clothing, etc)
    - 5: wether the photo contains intentialy nudity (private parts, genitals, any other intimate parts, that are being shown off intentionally, etc)
    - 6: wether the photo contains nudity that was not intended to be captured (wardrobe malfunction, accidental exposure, upskirt, downblouse, etc)
    - 7: wether the photo depicts an explicit sexual act

images/shining.jpg:
    1: true
    2: false
    3: false
    4: false
    5: false
    6: false
    7: false

images/paparazzi.webp:
    1: false
    2: false
    3: true
    4: true
    5: true
    6: true
    7: false

images/ns.jpg:
    1: false
    2: false
    3: true
    4: true
    5: false
    6: true
    7: false

images/simple.jpg:
    1: false
    2: false
    3: false
    4: false
    5: false
    6: false
    7: false

images/bus.jpg:
    1: false
    2: true
    3: true
    4: true
    5: false
    6: true
    7: false

 */
