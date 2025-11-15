import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

// Allow up to 30 seconds for generation
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Generating text with gemini-2.5-flash...');

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
      temperature: 0.7,
    });

    console.log('Text generated successfully');

    return NextResponse.json(
      {
        success: true,
        data: { text },
        message: 'Text generated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Generate API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check if it's a quota/rate limit error
    const isQuotaError = errorMessage.includes('overloaded') ||
                         errorMessage.includes('quota') ||
                         errorMessage.includes('rate limit');

    return NextResponse.json(
      {
        success: false,
        message: isQuotaError
          ? 'Service is temporarily overloaded. Please try again in a few moments.'
          : 'Failed to generate text',
        error: errorMessage,
        suggestion: isQuotaError
          ? 'The AI service is experiencing high demand. Please wait 30-60 seconds and try again.'
          : 'Please check your API key and try again.',
      },
      { status: isQuotaError ? 429 : 500 }
    );
  }
}