# 💋 Gossip Girl

**Your campus. Your secrets. Your stories.**

Gossip Girl is a campus-themed web application where students can explore anonymous gossip, discover what's happening around them, and share stories through a moderated submission workflow.

🔗 **Live Demo:** [Visit Gossip Girl](https://nour1114.github.io/gossip-girl/)

## ✨ Features

- 📰 **Gossip Feed:** Browse published gossip posts.
- 🔎 **Search:** Find posts using keywords.
- ↕️ **Sorting:** Explore posts in different orders.
- ➕ **Load More:** Browse additional posts without overwhelming the page.
- 🔄 **Refresh:** Refresh the feed to check for updates.
- 🚩 **Reporting:** Report posts that may violate community guidelines.
- 🛡️ **Moderation-Oriented Submission:** A submission workflow designed with server-side processing and anti-bot protection.
- 📱 **Responsive Interface:** Designed for an accessible browsing experience across screen sizes.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and responsive layouts |
| JavaScript | Client-side interactions and application logic |
| Supabase | Backend services and data storage |
| Cloudflare Turnstile | Bot protection |
| Supabase Edge Functions | Server-side submission processing |
| EmailJS | Email integration |
| TVmaze API | TV show, cast, and episode data integration |
| TMDB API | Movie and TV media data integration |
| GIPHY API | GIF search integration |

*Some integrations are optional and require configuration before they can be used.*

## 🏗️ How It Works

Gossip Girl combines a frontend interface with backend services to support content browsing and submission workflows.

1. The frontend displays available gossip posts and provides search, sorting, refresh, and reporting interactions.
2. Supabase provides backend infrastructure for supported data operations.
3. The submission workflow is designed to use a server-side function and Cloudflare Turnstile verification.
4. Optional APIs can extend the experience with entertainment information, GIFs, and email functionality.

**Important:** The gossip submission flow is currently under troubleshooting. Cloudflare Turnstile has returned error `110200`, so successful submission has not yet been verified. Features and integrations may require additional configuration or testing.

## 📂 Project Structure

The project includes frontend pages, styling, JavaScript modules, configuration, and integration documentation.

```text
gossip-girl/
├── index.html
├── css/
├── js/
│   ├── config.js
│   └── app.js
├── INTEGRATION-GUIDE.md
└── README.md
```

*This is a simplified overview. Actual folders and files may vary as the project evolves.*

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nour1114/gossip-girl.git
cd gossip-girl
```

### 2. Configure integrations

Review `INTEGRATION-GUIDE.md` and configure the required services for the features you want to enable.

If the project uses a configuration file such as `js/config.js`, provide the appropriate public client-side configuration values and follow each provider's security requirements.

**Never commit private API secrets, service-role keys, passwords, or other sensitive credentials to a public repository.** Browser-visible keys must be treated as public. Restrict them where supported, and enforce authorization through backend policies and server-side validation.

### 3. Run the project

Open `index.html` in a browser or use a local development server in VS Code.

For backend-dependent features, configure the corresponding Supabase services and deployment settings before testing.

## 🔐 Security Considerations

- Use server-side verification for Cloudflare Turnstile tokens.
- Configure Supabase Row Level Security (RLS) policies for database access.
- Validate and sanitize submitted content on the server.
- Apply appropriate rate limits and moderation rules.
- Keep private credentials out of frontend JavaScript and public commits.

A publishable Supabase key is intended for client-side use, but it does not replace proper database permissions or server-side authorization.

## 🧠 What I'm Learning

This project is helping me practice:

- Frontend development with HTML, CSS, and JavaScript.
- Connecting a web application to backend services.
- Working with third-party APIs.
- Understanding environment and configuration management.
- Designing submission workflows with anti-bot protection.
- Debugging browser errors and integration issues.
- Thinking about security, moderation, and user experience.

## 🗺️ Future Improvements

- Resolve and test the gossip submission workflow.
- Improve moderation and reporting workflows.
- Add stronger input validation and rate limiting.
- Test responsive behavior across different devices.
- Improve loading, empty, and error states.
- Complete and test optional API integrations.

## 👩‍💻 Author

**Nour Elsayed**  
Software Engineering Student at Sadat Academy for Management Sciences (SAMS)

GitHub: [@nour1114](https://github.com/nour1114)

---

*Gossip Girl is an independent student project created for learning and experimentation. Please use it responsibly and respect other people's privacy.*
