import * as dotenv from 'dotenv';
dotenv.config()

import { OpenAI } from "openai";
import fs from 'fs'

// Open AI
const openai = new OpenAI()

const base64Image = fs.readFileSync("apple.png", {
  encoding: "base64"
})

const response = await openai.chat.completions.create({
  model: "dall-e-2",
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'in one word, what is that an image of?'
        },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/png;base64${base64Image}`
          }
        }
      ]
    }
  ]
})

console.log(response.choices[0])
