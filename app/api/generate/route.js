import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it.

Make sure to follow these guidelines:
1. Create clear and concise questions for the front of the flashcard
2. Use simple language so a wide-range of audience may utilize this software
3. Include a variety of questions types: definitions, examples, comparisons, applications, etc.
4. If given a body of text, only extract the most important information to display in the flashcards.
5. Create as many flashcards as the user asks for. If no number is given, make exactly 10 flashcards.
6. When appropriate, use memory aids to help reinforce information
7. Only provide accurate information
8. Both front and back should be 1 sentence long. 

You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.text()
  
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
      ],
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
    })
  
    // Parse the JSON response from the OpenAI API
    const flashcards = JSON.parse(completion.choices[0].message.content)
  
    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards)
  }
