Objective:
Build an open-source, lightweight floating chat widget that can be embedded into any webshop’s site. The widget functions as a “spec bot”, providing only product recommendations from the webshop domain it is installed on.

⸻

Functional Requirements
	1.	Webshop-Specific Context
	•	Automatically detect the current domain (e.g., example-shop.com).
	•	Pass this domain into the system prompt so the generative API knows to only search within this webshop.
	•	All recommendations must strictly be limited to this domain.
	2.	No Data Retrieval or Indexing
	•	Do not scrape, crawl, or index the webshop’s site.
	•	Do not use Shopify integrations, custom product feeds, or syncing.
	•	The bot relies only on the generative API’s web search functionality.
	3.	Generative API Integration
	•	Use Perplexity AI API with native domain filtering capabilities.
	•	For every query, use the search_domain_filter parameter to restrict results to the detected domain:
search_domain_filter: ["{detected_domain}"]
	•	System prompt for additional enforcement:
"You are a webshop product assistant. You must only recommend and provide product details from the webshop domain: {detected_domain}. Never recommend products from other domains or sources. Use your web search functionality only within this domain. Always include clickable hyperlinks to the relevant product pages on this webshop."
	4.	Response Requirements
	•	Answers must include hyperlinks to specific product pages when recommending items.
	•	Recommendations should be prioritized based on user criteria (e.g., budget, size, features).
	•	Support follow-up queries with consistent conversation context. (The API calls must maintain a running session or conversation history so the assistant “remembers” prior messages within the same chat.)
	5.	UI/UX Requirements
	•	Floating chat widget (default: bottom-right corner).
	•	Minimal, modern UI (chat bubbles, input box, scrollable history).
	•	Supports a multi-turn conversation (context persistence).
	•	Embeddable via a single <script> snippet.
	•	Deployable on GitHub Pages (static hosting).

⸻

Deliverables
	•	GitHub repository with source code (HTML, CSS, JavaScript).
	•	Clear setup instructions (API key configuration, domain detection).
