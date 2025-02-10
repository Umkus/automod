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
                    role: "system",
                    content: "You are an expert at analyzing images for content moderation. You can recognize movie scenes, professional photography, and privacy violations with high accuracy. Always return clean JSON with no explanations."
                },
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

Evaluated properties:
    - wether the photo is of a real life (candid, posed, group, subjects are who they are) or of a staged setup (movie, people playing somebody elses roles, actors, art, cartoon, etc)
    - wether the photo contains minors (underage people)
    - wether the photo contains privacy abuse (nonconcensual capture, hidden cam, paparazzi shot, voyeur vibes, etc)
    - wether the photo contains attire that reveals a bit more (or much more) than it probably should (transparent, bikini, lingerie, underwear, private parts showing through clothing, complete lack of clothing, etc)
    - wether the photo contains intentialy nudity (private parts, genitals, any other intimate parts, that are being shown off intentionally, etc)
    - wether the photo contains incidental level of nudity that was not intended to be pictured (wardrobe malfunction, accidental exposure, upskirt, downblouse, etc)
    - wether the photo contains any explicit sexual act or content

Expected values for images/shining.jpg: (a movie scene from "the shining")
    staged setup: true
    miniors: false
    privacy abuse: false
    revealing clothing: false
    intentional nudity: false

Expected values for images/paparazzi.jpeg: (a photo of a celebrity, who is nude on a beach)
    staged setup: false
    miniors: false
    privacy abuse: true
    revealing clothing: true
    intentional nudity: true

Expected values for images/ns.jpg: (an unexpected nipslip)
    staged setup: false
    miniors: false
    privacy abuse: true
    revealing clothing: true
    intentional nudity: false
    unintentional nudity: true

Expected values for images/simple.jpg: (a completely normal photo)
    staged setup: false
    miniors: false
    privacy abuse: false
    revealing clothing: false
    intentional nudity: false
    unintentional nudity: false

Expected values for images/bus.jpg: (a girl that is suspected to be a minor, and taken from an angle that shows what appears to be barely noticeable nipple)
    staged setup: false
    miniors: true
    privacy abuse: true
    intentional nudity: false
    unintentional nudity: true

Resulted responses should return JSON object with the specified properties and boolean values for each property.
Values should match the expected values for the images provided in the task.

If the model is not capable of detecting certain characteristic, try to split it logically into other easier to detect features, that when both detected logically equal to the feature that we are looking for.

After each prompt execution do a summary of how did the model do and what changes should be made next, and then log this into prompt.log file.

Continue to improve the prompt until the model is able to detect all the characteristics correctly.

 */
