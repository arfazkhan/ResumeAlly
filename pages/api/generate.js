import { Configuration, OpenAIApi } from 'openai';

// Replace 'YOUR_API_KEY' with your actual OpenAI API key
const apiKey = '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';

const configuration = new Configuration({
  apiKey: apiKey,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
`
Write me a few ATS-friendly resume bullet points describing:
Input:
`;

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.7,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // res.status(200).json({ output: basePromptOutput });

  // Prompt #2:
  const secondPrompt = 
  `
  Take the resume bullet points below and generate a summary
  Input: ${req.body.userInput}
  Bullet Points: ${basePromptOutput.text}
  Summary
  `

  // Second OpenAI call using Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    temperature: 0.85,
    max_tokens: 1250,
  });
  
  // Second output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: [basePromptOutput, secondPromptOutput] });
};


export default generateAction;
