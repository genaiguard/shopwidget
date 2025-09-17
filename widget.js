/**
 * ShopSpec Chat Widget
 * A lightweight floating chat widget for webshop product recommendations using Perplexity AI
 */

class ShopSpecWidget {
    constructor() {
        this.apiKey = null;
        this.currentDomain = null;
        this.conversationHistory = [];
        this.isTyping = false;

        this.init();
    }

    init() {
        // Detect domain
        this.detectDomain();

        // Create widget HTML
        this.createWidget();

        // Set up event listeners
        this.setupEventListeners();

        // Load configuration
        this.loadConfiguration();
    }

    detectDomain() {
        try {
            // Get the current domain
            this.currentDomain = window.location.hostname;

            // Remove www. prefix if present
            if (this.currentDomain.startsWith('www.')) {
                this.currentDomain = this.currentDomain.substring(4);
            }

            console.log('ShopSpec: Detected domain:', this.currentDomain);
        } catch (error) {
            console.error('ShopSpec: Error detecting domain:', error);
            this.currentDomain = 'example-shop.com'; // fallback
        }
    }

    createWidget() {
        const widgetContainer = document.getElementById('shopspec-widget');

        widgetContainer.innerHTML = `
            <!-- Chat Button -->
            <button class="shopspec-chat-button" id="shopspec-chat-button" title="Chat with our product assistant">
                💬
            </button>

            <!-- Chat Window -->
            <div class="shopspec-chat-window" id="shopspec-chat-window">
                <div class="shopspec-chat-header">
                    <h3>Product Assistant</h3>
                    <button class="shopspec-close-button" id="shopspec-close-button">×</button>
                </div>

                <div class="shopspec-chat-messages" id="shopspec-chat-messages">
                    <div class="shopspec-message bot">
                        Hi! I'm your product assistant. I can help you find the perfect products from ${this.currentDomain}. What are you looking for?
                    </div>
                </div>

                <div class="shopspec-typing-indicator" id="shopspec-typing-indicator">
                    Assistant is typing...
                </div>

                <div class="shopspec-chat-input">
                    <input
                        type="text"
                        class="shopspec-input-field"
                        id="shopspec-input-field"
                        placeholder="Ask about products..."
                        maxlength="500"
                    >
                    <button class="shopspec-send-button" id="shopspec-send-button">
                        ➤
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const chatButton = document.getElementById('shopspec-chat-button');
        const closeButton = document.getElementById('shopspec-close-button');
        const sendButton = document.getElementById('shopspec-send-button');
        const inputField = document.getElementById('shopspec-input-field');

        // Toggle chat window
        chatButton.addEventListener('click', () => this.toggleChat());

        // Close chat window
        closeButton.addEventListener('click', () => this.closeChat());

        // Send message on button click
        sendButton.addEventListener('click', () => this.sendMessage());

        // Send message on Enter key
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Enable/disable send button based on input
        inputField.addEventListener('input', (e) => {
            sendButton.disabled = !e.target.value.trim();
        });

        // Initial state
        sendButton.disabled = true;
    }

    loadConfiguration() {
        // Try to load API key from various sources
        // Priority: data attribute > global variable > meta tag

        // Check for data attribute on script tag
        const scriptTag = document.querySelector('script[src*="widget.js"]');
        if (scriptTag) {
            this.apiKey = scriptTag.getAttribute('data-api-key') ||
                         scriptTag.getAttribute('data-perplexity-key');
        }

        // Check for global variable
        if (!this.apiKey && window.shopspecConfig) {
            this.apiKey = window.shopspecConfig.apiKey ||
                         window.shopspecConfig.perplexityKey;
        }

        // Check for meta tag
        if (!this.apiKey) {
            const metaTag = document.querySelector('meta[name="shopspec-api-key"]');
            if (metaTag) {
                this.apiKey = metaTag.getAttribute('content');
            }
        }

        if (!this.apiKey) {
            console.warn('ShopSpec: No API key found. Please configure your Perplexity API key.');
            this.showError('API key not configured. Please check setup instructions.');
        }
    }

    toggleChat() {
        const chatWindow = document.getElementById('shopspec-chat-window');
        const chatButton = document.getElementById('shopspec-chat-button');

        if (chatWindow.classList.contains('open')) {
            this.closeChat();
        } else {
            chatWindow.classList.add('open');
            chatButton.style.display = 'none';

            // Focus on input field
            setTimeout(() => {
                document.getElementById('shopspec-input-field').focus();
            }, 100);
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('shopspec-chat-window');
        const chatButton = document.getElementById('shopspec-chat-button');

        chatWindow.classList.remove('open');
        chatButton.style.display = 'flex';
    }

    async sendMessage() {
        const inputField = document.getElementById('shopspec-input-field');
        const message = inputField.value.trim();

        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');

        // Clear input
        inputField.value = '';

        // Disable send button
        document.getElementById('shopspec-send-button').disabled = true;

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send to Perplexity API
            const response = await this.callPerplexityAPI(message);

            // Hide typing indicator
            this.hideTypingIndicator();

            // Add bot response
            this.addMessage(response, 'bot');

        } catch (error) {
            console.error('ShopSpec: API Error:', error);
            this.hideTypingIndicator();
            this.showError('Sorry, I encountered an error. Please try again.');
        }
    }

    async callPerplexityAPI(userMessage) {
        if (!this.apiKey) {
            throw new Error('API key not configured');
        }

        // Add user message to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        const systemPrompt = `You are a webshop product assistant. You must only recommend and provide product details from the webshop domain: ${this.currentDomain}. Never recommend products from other domains or sources. Use your web search functionality only within this domain. Always include clickable hyperlinks to the relevant product pages on this webshop.`;

        const messages = [
            {
                role: 'system',
                content: systemPrompt
            },
            ...this.conversationHistory
        ];

        const requestBody = {
            model: 'sonar-pro', // Using sonar-pro for better search capabilities
            messages: messages,
            search_domain_filter: [this.currentDomain], // Perplexity's domain filtering
            max_tokens: 1000,
            temperature: 0.1 // Lower temperature for more focused responses
        };

        try {
            const response = await fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid API response format');
            }

            const botResponse = data.choices[0].message.content;

            // Add bot response to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: botResponse
            });

            // Keep conversation history manageable (last 20 messages)
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

            return botResponse;

        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error - please check your internet connection');
            }
            throw error;
        }
    }

    addMessage(content, type) {
        const messagesContainer = document.getElementById('shopspec-chat-messages');

        const messageDiv = document.createElement('div');
        messageDiv.className = `shopspec-message ${type}`;
        messageDiv.innerHTML = content; // Using innerHTML to support links

        messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        this.isTyping = true;
        const indicator = document.getElementById('shopspec-typing-indicator');
        indicator.classList.add('show');
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('shopspec-typing-indicator');
        indicator.classList.remove('show');
    }

    showError(message) {
        this.addMessage(`❌ ${message}`, 'bot');
    }
}

// Initialize widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shopspecWidget = new ShopSpecWidget();
});

// Also initialize if script is loaded after DOM
if (document.readyState === 'loading') {
    // DOM not yet loaded
} else {
    // DOM already loaded
    if (!window.shopspecWidget) {
        window.shopspecWidget = new ShopSpecWidget();
    }
}
