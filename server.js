// const Api = require('./apiFile.js');

import { Configuration, OpenAIApi } from "openai"
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// gives access to .env file that contains keys
require('dotenv').config()

// There are 2 ways for the configuration to work, by default using the key in the .env file
// Otherwise you need to add the key manually
const configuration = new Configuration({
    // This key is in the .env file
    apiKey: process.env.CHAT_GPT
    // Change this to the key with quotes for example apiKey: "aaabbbccc123"
    // apiKey: ""
});

const openai = new OpenAIApi(configuration);

async function sendPrompt(){
    const model = 'gpt-3.5-turbo'
    const messages = [
        {
            "role": 'system',
            "content": 'You are a happy and ditzy girl in her early twenties. She likes to take thorough her thoughts as she answers.'
        },
        {
            "role": 'user',
            "content": 'Hi, give me 5 story ideas'
        }
    ]

    // Reads the messages and creates a response with chatGPT
    const completion = await openai.createChatCompletion({
        model,
        messages
    })
    console.log(completion.data.choices)
}

sendPrompt()




