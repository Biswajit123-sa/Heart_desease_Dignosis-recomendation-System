const Groq = require("groq-sdk");
const ChatHistory = require("../models/ChatHistory");

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_CHATBOT_API_KEY });
const model = process.env.GROQ_MODEL_CHATBOT || "llama-3.3-70b-versatile";

/**
 * @desc    Process follow up chat with the AI model
 * @route   POST /api/chat
 * @access  Private (Requires Bearer Token)
 */
const postChat = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    // 1. System Prompt
    let systemPrompt = 
      "You are a helpful, empathetic medical AI assistant. " +
      "Your task is to answer the patient's follow-up questions clearly and safely. " +
      "Keep your responses very short, simple, and easy for a non-medical person to understand. Avoid complex medical jargon. " +
      "Do not provide a definitive diagnosis. If the patient needs urgent care, advise them to seek medical attention.";
      
    if (context) {
      systemPrompt += `\n\nContext regarding the patient's heart risk assessment report:\n${context}`;
    }

    // 2. Fetch existing history for the logged-in user
    let chatSession = await ChatHistory.findOne({ user: req.user._id });
    
    let messages = [{ role: "system", content: systemPrompt }];
    let dbMessages = []; // For saving to DB
    
    if (chatSession) {
      dbMessages = [...chatSession.messages];
      // Append past history to the prompt payload (exclude old system prompts from db to keep it clean, though we only saved user/assistant)
      dbMessages.forEach(msg => messages.push({ role: msg.role, content: msg.content }));
    } else {
      chatSession = new ChatHistory({ user: req.user._id, messages: [] });
    }

    // 3. Append the new user message
    const userMsg = { role: "user", content: message };
    messages.push(userMsg);
    dbMessages.push(userMsg);

    // 4. Call Groq
    console.log(`[ChatbotController] Calling Groq model ${model} for user ${req.user._id}...`);
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: model,
      temperature: 0.4,
    });

    const responseText = chatCompletion.choices[0].message.content.trim();

    // 5. Save the assistant's reply
    const assistantMsg = { role: "assistant", content: responseText };
    dbMessages.push(assistantMsg);

    chatSession.messages = dbMessages;
    await chatSession.save();

    res.status(200).json({ reply: responseText });
    
  } catch (error) {
    console.error(`[ChatbotController] Error: ${error.message}`);
    res.status(500).json({ message: "An unexpected error occurred during chat processing." });
  }
};

module.exports = {
  postChat,
};
