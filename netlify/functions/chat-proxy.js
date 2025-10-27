// netlify/functions/chat-proxy.js
exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, userId } = JSON.parse(event.body);
    
    if (!userId) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const GPT_URL = 'https://chatgpt.com/g/g-683cebc908a48191a9cb9c87a6414084-vitalidad-total-by-lifehuni';
    
    const response = await simulateChatGPTInteraction(message);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        response: response,
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

async function simulateChatGPTInteraction(message) {
  const responses = {
    'maca': '**Maca-Life** - Nuestro suplemento estrella de maca andina premium. Beneficios: energía natural, equilibrio hormonal, mejora de libido, reducción de estrés. Dosis: 500-1000mg por la mañana.',
    'proteína': '**Proteína Vegetal LifeHuni** - Combinación de guisante (70%) y arroz integral (30%) con enzimas digestivas. Ideal para musculación y recuperación.',
    'vitamina': '**Complex Vitamínico Premium** - Incluye D3 (5000 UI), B12 metilcobalamina, vitamina C liposomal. Soporte completo para inmunidad y energía.',
    'mineral': '**Minerales Esenciales** - Zinc, magnesio glicinato, selenio. Fundamental para función enzimática y salud ósea.',
    'energía': '**Protocolo Energía Vital**: Maca-Life + Complex B + CoQ10. Aumenta energía natural sin estimulantes.',
    'sueño': '**Mejora del Sueño**: Magnesio glicinato + L-Theanine + GABA. Sueño reparador natural.',
    'digestión': '**Salud Digestiva**: Probiotics 50B + Enzimas digestivas + L-Glutamina. Restaura microbioma intestinal.',
    'precio': 'Para información de precios y compra, contacta a nuestro equipo:\n📞 WhatsApp: +57 300 123 4567\n📧 Email: pedidos@lifehuni.com',
    'default': '¡Hola! Soy **Vitalidad Total by LifeHuni**, tu asesor especializado en suplementos naturales. ¿En qué puedo ayudarte específicamente? Puedo asesorarte sobre:\n\n• Maca-Life (energía y hormonas)\n• Proteínas vegetales\n• Vitaminas y minerales\n• Protocolos personalizados\n\n¡Cuéntame tus objetivos!'
  };

  const lowerMessage = message.toLowerCase();
  
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  return responses.default;
}
