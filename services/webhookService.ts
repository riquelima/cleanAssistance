const WEBHOOK_URL = 'https://primary-production-76569.up.railway.app/webhook/e2b21e34-2929-42c3-8c7f-a10a98e3b11e';

/**
 * Cleans the bot response by extracting content from a potential iframe srcdoc
 * and decoding HTML entities. This handles a specific output format from some
 * webhook providers that wrap responses in iframes for sandboxing.
 * @param text The raw text response from the bot.
 * @returns The cleaned, user-visible text.
 */
function cleanBotResponse(text: string): string {
  const trimmedText = text.trim();

  // Check if the string looks like an iframe tag. A simple check is enough.
  if (trimmedText.startsWith('<iframe') && trimmedText.endsWith('</iframe>')) {
    try {
      // Use a regex to extract the srcdoc attribute value.
      // This captures everything between the quotes of srcdoc.
      const match = trimmedText.match(/srcdoc="([\s\S]*?)"/);
      if (match && match[1]) {
        const srcdocContent = match[1];
        // Use a DOM element to safely decode HTML entities like &quot;
        const decoder = document.createElement('textarea');
        decoder.innerHTML = srcdocContent;
        return decoder.value;
      }
    } catch (e) {
      console.error("Error parsing iframe srcdoc:", e);
      // Fallback to returning the original text if parsing fails
      return text;
    }
  }
  
  // If it's not an iframe, return the original text
  return text;
}


export async function getBotResponse(userMessage: string): Promise<string> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: userMessage }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not retrieve error message body');
      console.error('Webhook response not OK:', response.status, response.statusText, errorText);
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const responseText = await response.text();
    if (!responseText) {
      console.warn('Received an empty response from server.');
      return 'Desculpe, recebi uma resposta vazia do servidor.';
    }
    
    let botText = responseText; // Default to the full response text

    try {
      // Try to parse as JSON, as this is the most likely format from n8n
      const data = JSON.parse(responseText);

      // n8n can return an array of items, we usually care about the first one.
      const item = Array.isArray(data) ? data[0] : data;

      // In n8n, the output of a node is often nested in a 'json' property.
      const content = item.json || item;
      
      let foundText: string | null = null;
      // Look for the answer in common properties.
      if (content && typeof content.myField === 'string') {
        foundText = content.myField;
      } else if (content && typeof content.text === 'string') {
        foundText = content.text;
      } else if (content && typeof content.message === 'string') {
        foundText = content.message;
      } else if (content && typeof content.answer === 'string') {
        foundText = content.answer;
      } else if (content && typeof content.reply === 'string') {
        foundText = content.reply;
      } else if (typeof content === 'string') {
        // If the content itself is a string
        foundText = content;
      }
      
      if (foundText !== null) {
        botText = foundText;
      } else {
        // As a fallback for debugging, stringify the received object.
        console.warn('Could not find a known text property in webhook response. Displaying raw JSON.', content);
        botText = JSON.stringify(content, null, 2);
      }

    } catch (e) {
      // If JSON parsing fails, it's likely a plain text response.
      // botText is already set to responseText, so we do nothing here.
    }
    
    // Clean the final determined text (whether from JSON or plain text)
    return cleanBotResponse(botText);

  } catch (error) {
    console.error('Error calling webhook:', error);
    // This will be caught by the App component and show a generic error message.
    throw error;
  }
}