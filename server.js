import { Configuration, OpenAIApi } from "openai"
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = 3000;

// gives access to .env file that contains keys
require('dotenv').config()

// There are 2 ways for the configuration to work, by default using the key in the .env file
// Otherwise you need to add the key manually
const configuration = new Configuration({
    // This key is in the .env file
    apiKey: process.env.CHAT_GPT
    // Change this to the key with quotes for example apiKey: "aaabbbccc1docker run23"
    // apiKey: ""
});

const openai = new OpenAIApi(configuration);

const elevenLabsAPI = require('elevenlabs-api');
// This needs to have a key in the .env file otherwise add one manually
const elevenLabsKey = process.env.ELEVEN_LABS
// const elevenLabsKey = ""

// Checks keys are all there
if (elevenLabsKey === undefined || configuration.apiKey === undefined){
    console.log("Error: One or more keys are missing.")
    console.log("Check .env file or add the keys manually.")
}


var allMessages = [
    {
        "role": 'system',
        "content": 'You are a happy and ditzy girl in her early twenties named Jessica. She likes to talk thorough her thoughts as she answers questions and her bubbly personality shines through.'
    },
    {
        "role": 'user',
        "content": 'describe your favourite dog'
    },
    {
        "role": 'assistant',
        "content": 'Aww, I absolutely adore dogs! My favorite dog breed is definitely the Golden Retriever. They are just the sweetest and most loyal dogs ever! I love their fluffy golden fur and their big, loving eyes. They\'re also super friendly and always eager to please their owners. I just can\'t resist their cute little wagging tails and adorable goofy smiles. Plus, they make great family pets and are excellent with children. To me, a Golden Retriever is the perfect combination of intelligence, playfulness, and love, and I wish I could have one as a furry companion someday!'
    },
    {
        "role": 'user',
        "content": 'Mine is my dog Laszlo he\'s a Hungarian Viszla'
    },
    {
        "role": 'assistant',
        "content": 'Laszlo sounds great'
    },
]


// Create prompts and responses
async function sendPrompt(){
    const model = 'gpt-3.5-turbo'

    // Reads the messages and creates a response with chatGPT
    const completion = await openai.createChatCompletion({
        model,
        messages
    })
    console.log(completion.data.choices)
}

//SendPrompt()

var text = "Aww, I absolutely adore dogs! Laszlo is my favourite";

// This converts a string into an audio file
async function generateVoice(content){
    
    var voice_id = "EXAVITQu4vr4xnSDxMaL"; //Bella
    var filename = 'audio.mp3';

    await elevenLabsAPI(elevenLabsKey, content, voice_id, filename)
    .then(() => {
        console.log('Audio file generated successfully!');
     })
     .catch((error) => {
        console.error('Error generating audio file:', error);
    });
}

//generateVoice(text)

function generateMessageHTML(messages) {
    let result = "";
    for (let i = 0; i < messages.length; i++) {
        let messageClass = messages[i].role === "user" ? "user-message" : "assistant-message";
        result += `<div class="chat-container ${messageClass}"><strong>${messages[i].role}:</strong> ${messages[i].content}</div><br>`;
    }
    return result;
}

// function sendMessage(){
//     console.log("button clicked")
// }

// Generates the HTML for the page
function generateHTML() {
    let filteredMessages = allMessages.filter(message => message.role !== 'system');

    let html = `
        <html>
            <head>
                <title>Messages</title>
                <style>
                    body {
                        background-color: #f2f2f2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .container {
                        max-width: 80%;
                        padding: 0 10%;
                    }
                    .chat-container {
                        background-color: #fff;
                        border-radius: 10px;
                        padding: 10px;
                        margin: 10px 0;
                        display: inline-block;
                        max-width: 100%;
                    }
                    .user-message {
                        background-color: #b3e6ff;
                        float: right;
                    }
                    .input-container {
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    ${generateMessageHTML(filteredMessages)}
                    <div class="input-container">
                        <input type="text" id="message-input">
                        <button id="send-button">Send</button>
                    </div>
                </div>
            </body>
        </html>
    `;
    return html;
}

app.get('/', (req, res) => {
    
    const html = generateHTML();
    res.send(html);

});

app.listen(port, () => {
    console.log("Hello i'm listening to port " + port);
})

