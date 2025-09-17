# ShopSpec Chat Widget

A lightweight, open-source floating chat widget that provides AI-powered product recommendations exclusively from your webshop domain using Perplexity AI.

## Features

- 🚀 **Lightweight**: Single ~25KB script with embedded CSS
- 🔒 **Domain-Specific**: Only recommends products from your webshop
- 💬 **Context-Aware**: Maintains conversation history across queries
- 📱 **Responsive**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean, professional chat interface
- ⚡ **Fast**: No external dependencies, works offline-ready
- 🔧 **Easy Integration**: Single script tag installation

## How It Works

1. **Domain Detection**: Automatically detects your webshop's domain
2. **AI-Powered Search**: Uses Perplexity AI with domain filtering to find products
3. **Context Preservation**: Remembers conversation history for follow-up questions
4. **Link Generation**: Provides clickable links to actual product pages

## Quick Start

### 1. Get a Perplexity AI API Key

1. Visit [Perplexity AI](https://www.perplexity.ai/)
2. Sign up for an account
3. Navigate to API settings and generate an API key
4. Note: You'll need a paid plan for API access

### 2. Add the Widget to Your Webshop

Add this script tag to your HTML `<head>` or before the closing `</body>` tag:

```html
<script
    src="https://your-github-username.github.io/shopspec-widget/shopspec-widget.js"
    data-api-key="your-perplexity-api-key-here">
</script>
```

Replace `your-github-username` with your actual GitHub username and `your-perplexity-api-key-here` with your API key.

### 3. Alternative Configuration Methods

#### Option A: Global Configuration
```html
<script>
    window.shopspecConfig = {
        apiKey: 'your-perplexity-api-key-here'
    };
</script>
<script src="https://your-github-username.github.io/shopspec-widget/shopspec-widget.js"></script>
```

#### Option B: Meta Tag
```html
<meta name="shopspec-api-key" content="your-perplexity-api-key-here">
<script src="https://your-github-username.github.io/shopspec-widget/shopspec-widget.js"></script>
```

## API Configuration

The widget requires a Perplexity AI API key. The API call uses:

- **Model**: `sonar-pro` (for best search capabilities)
- **Domain Filtering**: `search_domain_filter: ["yourdomain.com"]`
- **System Prompt**: Enforces domain-specific responses
- **Context**: Maintains conversation history

## Security Considerations

- 🔐 **API Key Protection**: Never expose your API key in client-side code
- 🌐 **Domain Restriction**: All recommendations are filtered to your domain only
- 🚫 **No Data Collection**: The widget doesn't store or transmit user data
- ✅ **HTTPS Required**: Only works on secure websites

## Customization

### Styling
The widget uses CSS custom properties. You can override styles:

```html
<style>
    :root {
        --shopspec-primary: #your-color;
        --shopspec-primary-dark: #your-dark-color;
    }
</style>
```

### Positioning
Default is bottom-right. Override with:

```css
#shopspec-widget {
    bottom: 20px !important;
    right: 20px !important;
}
```

## Development

### Local Testing

1. Clone this repository
2. Open `index.html` in your browser
3. The widget will show a demo interface

### File Structure

```
shopspec-widget/
├── index.html          # Demo page
├── styles.css          # Widget styles (development)
├── widget.js          # Widget logic (development)
├── shopspec-widget.js # Embeddable script (production)
└── README.md          # This file
```

### Building for Production

The `shopspec-widget.js` file is the production-ready embeddable script that includes all CSS and JavaScript.

## API Usage & Costs

- **Free Tier**: Limited requests per month
- **Paid Plans**: $0.005 - $0.028 per request (sonar-pro model)
- **Rate Limits**: Vary by plan (typically 1-10 requests/second)

Monitor your usage at [Perplexity Dashboard](https://www.perplexity.ai/settings/api).

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Widget Not Appearing
- Check browser console for errors
- Verify API key is correctly configured
- Ensure the script is loaded after DOM elements

### API Errors
- Verify API key is valid and has credits
- Check network connectivity
- Review rate limits

### Domain Detection Issues
- Widget automatically detects `window.location.hostname`
- For subdomains, it strips `www.` prefix
- Custom domains can be configured if needed

## License

MIT License - see LICENSE file for details.

## Support

- 📧 **Email**: Create an issue on GitHub
- 💬 **Issues**: [GitHub Issues](https://github.com/your-username/shopspec-widget/issues)
- 📖 **Documentation**: This README

---

**Built with ❤️ for webshops everywhere**
