import { OpenAI } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { pantryItems } = req.body;
  const pantryDescription = pantryItems.map(item => `${item.name} ${item.count}`).join(', ');
  const prompt = `Given these pantry items: ${pantryDescription}. What are some recipes I can make with only these items? Output must be 2 lines per recipe, for example: 1. Recipe Name [new line] Instructions: ...`;

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'system',
          content: 'You are a culinary assistant capable of suggesting recipes based on available ingredients.\nList all possible recipes and their respective details.\nUse example input and example output as structure guideline.\nExample input: [{name: \'Apple\', count: 2}]\nExample output: recipeName: \'1. Apple Crisp\', instructions: \'A classic dessert that is simple to make. Peel and slice the apples, then top them with a mixture of oats, brown sugar, butter, and cinnamon. Bake until golden and bubbly.\',Recipe: \'2. Apple Sauce\', Instructions: \'Peel, core, and chop the apples. Simmer them with a little water, sugar, and cinnamon until soft. Mash or blend for a smooth apple sauce.\', ...'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const rawText = response.choices[0].message.content;
    const recipeSuggestions = rawText.split('\n').filter(line => line.trim() !== '').map((line, index) => {
        return {
            recipeNum: index + 1,
            recipeName: line.split(':')[0].trim(),
            details: line.split(':').slice(1).join(':').trim()
        }
    });

    res.status(200).json(recipeSuggestions);
  } catch (error) {
    console.error('Failed to generate recipes:', error);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
}