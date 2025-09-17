/**
 * ShopSpec Chat Widget - Embeddable Version
 * Single file containing CSS + JS for easy integration
 */

(function() {
    // Inject CSS
    const css = `
        /* ShopSpec Chat Widget Styles */
        #shopspec-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .shopspec-chat-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
        }

        .shopspec-chat-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
        }

        .shopspec-chat-button:active {
            transform: scale(0.95);
        }

        .shopspec-chat-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            display: none;
            flex-direction: column;
            overflow: hidden;
            animation: shopspec-slideUp 0.3s ease-out;
        }

        @keyframes shopspec-slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .shopspec-chat-window.open { display: flex; }

        .shopspec-chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
        }

        .shopspec-chat-header h3 { margin: 0; font-size: 16px; }

        .shopspec-close-button {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
        }

        .shopspec-close-button:hover { background-color: rgba(255, 255, 255, 0.2); }

        .shopspec-chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: #f8fafc;
        }

        .shopspec-message {
            margin-bottom: 12px;
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 80%;
            word-wrap: break-word;
            line-height: 1.4;
        }

        .shopspec-message.user {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 4px;
        }

        .shopspec-message.bot {
            background: white;
            color: #374151;
            border-bottom-left-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .shopspec-message.typing {
            background: white;
            color: #6b7280;
            font-style: italic;
            border-bottom-left-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .shopspec-chat-input {
            padding: 16px;
            background: white;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 8px;
        }

        .shopspec-input-field {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 24px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.2s;
        }

        .shopspec-input-field:focus { border-color: #667eea; }

        .shopspec-send-button {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .shopspec-send-button:hover { transform: scale(1.05); }

        .shopspec-send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .shopspec-typing-indicator {
            display: none;
            padding: 8px 16px;
            color: #6b7280;
            font-size: 14px;
            font-style: italic;
        }

        .shopspec-typing-indicator.show { display: block; }

        @media (max-width: 480px) {
            .shopspec-chat-window {
                width: calc(100vw - 40px);
                height: calc(100vh - 140px);
                bottom: 80px;
                right: 20px;
            }
            #shopspec-widget { bottom: 20px; right: 20px; }
        }

        .shopspec-message a { color: #667eea; text-decoration: underline; }
        .shopspec-message.user a { color: #e0e7ff; }
    `;

    // Inject CSS into head
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // ShopSpec Widget Class
    class ShopSpecWidget {
        constructor() {
            this.apiKey = null;
            this.currentDomain = null;
            this.conversationHistory = [];
            this.isTyping = false;
            this.init();
        }

        init() {
            this.detectDomain();
            this.createWidget();
            this.setupEventListeners();
            this.loadConfiguration();
        }

        detectDomain() {
            try {
                this.currentDomain = window.location.hostname;
                if (this.currentDomain.startsWith('www.')) {
                    this.currentDomain = this.currentDomain.substring(4);
                }
                console.log('ShopSpec: Detected domain:', this.currentDomain);
            } catch (error) {
                console.error('ShopSpec: Error detecting domain:', error);
                this.currentDomain = 'example-shop.com';
            }
        }


        createWidget() {
            // Check if widget already exists
            if (document.getElementById('shopspec-widget')) return;

            const widgetContainer = document.createElement('div');
            widgetContainer.id = 'shopspec-widget';

            widgetContainer.innerHTML = `
                <button class="shopspec-chat-button" id="shopspec-chat-button" title="Chat with our product assistant">
                    💬
                </button>
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

            document.body.appendChild(widgetContainer);
        }

        setupEventListeners() {
            const chatButton = document.getElementById('shopspec-chat-button');
            const closeButton = document.getElementById('shopspec-close-button');
            const sendButton = document.getElementById('shopspec-send-button');
            const inputField = document.getElementById('shopspec-input-field');

            chatButton.addEventListener('click', () => this.toggleChat());
            closeButton.addEventListener('click', () => this.closeChat());
            sendButton.addEventListener('click', () => this.sendMessage());

            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            inputField.addEventListener('input', (e) => {
                sendButton.disabled = !e.target.value.trim();
            });

            sendButton.disabled = true;
        }

        loadConfiguration() {
            // Check script tag for API key
            const scripts = document.querySelectorAll('script[src*="shopspec-widget.js"]');
            scripts.forEach(script => {
                this.apiKey = script.getAttribute('data-api-key') ||
                             script.getAttribute('data-perplexity-key') ||
                             this.apiKey;
            });

            // Check global config
            if (!this.apiKey && window.shopspecConfig) {
                this.apiKey = window.shopspecConfig.apiKey ||
                             window.shopspecConfig.perplexityKey;
            }

            // Check meta tag
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

            this.addMessage(message, 'user');
            inputField.value = '';
            document.getElementById('shopspec-send-button').disabled = true;
            this.showTypingIndicator();

            try {
                const response = await this.callPerplexityAPI(message);
                this.hideTypingIndicator();
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

            this.conversationHistory.push({
                role: 'user',
                content: userMessage
            });

            const systemPrompt = `You are a webshop product assistant. You must only recommend and provide product details from the webshop domain: ${this.currentDomain}. Never recommend products from other domains or sources. Use your web search functionality only within this domain.

The user is currently viewing this webpage: ${window.location.href}
Page title: ${document.title}

You MUST browse and analyze this URL (${window.location.href}) to understand what product or page the user is currently looking at. Read the page content, extract product details, specifications, and context.

When the user asks about "similar products" or recommendations, use the information from the current page to provide relevant suggestions for that specific product. Do not ask "what product are you referring to" - use the context from the page they are viewing.

When providing links, format them in markdown syntax like [Link Text](URL). Always include clickable hyperlinks to the relevant product pages on this webshop.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                ...this.conversationHistory
            ];

            const requestBody = {
                model: 'sonar-pro',
                messages: messages,
                search_domain_filter: [this.currentDomain],
                max_tokens: 1000,
                temperature: 0.1
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

                this.conversationHistory.push({
                    role: 'assistant',
                    content: botResponse
                });

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

            // Convert markdown links to HTML links
            const htmlContent = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

            const messageDiv = document.createElement('div');
            messageDiv.className = `shopspec-message ${type}`;
            messageDiv.innerHTML = htmlContent;

            messagesContainer.appendChild(messageDiv);
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

    // Initialize when DOM is ready
    function initWidget() {
        if (!window.shopspecWidget) {
            window.shopspecWidget = new ShopSpecWidget();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

    // Also initialize after a short delay to ensure body exists
    setTimeout(initWidget, 100);

})();
