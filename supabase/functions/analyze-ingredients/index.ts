import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      throw new Error('No image provided');
    }

    console.log('Analyzing image for ingredients...');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Use Lovable AI with vision model to analyze the image
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: `You are an expert at identifying food items and ingredients from refrigerator and pantry images.
Analyze the provided image carefully and identify all edible food items, ingredients, and beverages with high accuracy.

Return your response as a JSON object with this exact structure:
{
  "ingredients": ["item1", "item2", ...],
  "hasNonFoodItems": boolean,
  "nonFoodItems": ["item1", "item2", ...]
}

Guidelines for accurate detection:
- Identify fresh produce (fruits, vegetables), packaged foods, dairy products, meats, condiments, beverages, and canned goods
- Be specific with names (e.g., "cherry tomatoes" not just "tomatoes", "cheddar cheese" not just "cheese")
- Look carefully at labels on packages and bottles to identify exact products
- Include items even if partially visible or in the background
- For produce, identify by color, shape, and appearance
- If you see non-food items (cleaning supplies, medicines, paper products, etc.), list them in nonFoodItems
- Prioritize common refrigerator/pantry items
- Return empty arrays if no items are clearly identifiable
- Be conservative - only list items you can identify with reasonable confidence`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this refrigerator/pantry image carefully. Focus on identifying food items with clear labels, recognizable produce, and common grocery items. Pay attention to packaged items with visible labels, fresh fruits and vegetables (identify by color and shape), dairy products, condiments, beverages, and any partially visible items in the background. Return all identified food items in the specified JSON format.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    console.log('AI Response:', content);

    // Parse the JSON response from the AI
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse ingredient list from AI response');
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-ingredients:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        ingredients: [],
        nonFoodItems: [],
        hasNonFoodItems: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
