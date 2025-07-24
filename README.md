# 🔭 _Talaash_

*Talaash* is a sleek, Next.js-based chat application designed for seamless interaction with multiple large language models (LLMs) via OpenRouter. It provides an elegant and responsive user experience for a variety of use cases. It is not just another AI chat interface — it is a visual experience. Designed with modern aesthetics at its core, *Talaash* brings a fluid, minimalist, and distraction-free interface to your conversations with AI.

By combining clean design with the power of *OpenRouter’s* extensive model offerings, *Talaash* serves as a versatile platform for both end-users and developers seeking to integrate or extend LLM capabilities.

## ❔ _Getting Started_

1. Clone the repository.

```bash
git clone https://github.com/imrofayel/Talaash-Chat.git

cd Talaash-Chat
```

2. Install dependencies using your preferred package manager (🟡 _pnpm is recommended_).

```bash
pnpm install
```

3. Configure _Environment Variables_

```env
OPEN_BASE_URL=https://openrouter.ai/api/v1

OPENAI_API_KEY=<your-openrouter-api-key>
```

ℹ️ You can obtain an `API key` by signing up at [_OpenRouter_](https://openrouter.ai/settings/keys).

4. Run the development server.

```bash
pnpm dev
```

## 🔥 _Project Structure_

```bash
/app              # App router layout and route segments (Next.js App Router)

/components       # Reusable UI components (chat interface, buttons, layout blocks, etc.)

/hooks            # Custom React hooks for local state and side effects

/lib              # Utility functions

/store            # Global state management (e.g., current model)

/types            # TypeScript interfaces and type declarations

/public           # Static assets (icons, logos, fonts, etc.)

/styles           # Tailwind CSS configuration and global styles

/.vscode          # Workspace-specific VS Code settings

/.husky           # Git hooks (e.g., pre-commit checks)
```

## 👥 _Contributing_

We welcome and encourage community contributions. Whether it is a bug fix, feature enhancement, UI refinement, or performance optimization — your input is valuable.

### _How to Contribute?_

1. Fork the repository.
   
3. Create a new feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```
   
4. Make your changes and commit:

   ```bash
   git commit -m "feat:add-your-feature-description"
   ```
   
5. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```
   
6. Open a _pull request_ with a clear explanation of your changes.

## ⁉️ _Frequently Asked Questions (FAQ)_

> *Q1: Can I use paid models like Claude Pro or GPT-4 with Talaash?*

Yes, _Talaash_ allows you to use any model supported by _OpenRouter_, including paid ones such as _Claude_ (Anthropic) or _OpenAI's GPT-4_. To do so, simply use your own _OpenRouter API Key_. The app provides a filter to show only free models by default, but this can be disabled to access all available models.

> *Q2: Is this project free?*

Yes, *Talaash* is open source under the *MIT license*. You are free to use, modify, and extend it as per your needs. If you build something cool based on Talaash, let us know — we'd love to see it! 💫

> *Q3: Do I need to host my own backend to use Talaash?*

No. *Talaash* is frontend-only and communicates directly with *OpenRouter’s* hosted API. However, you can modify the code to point to your own proxy or LLM gateway if needed.

## :octocat: _License_

This project is licensed under the MIT License.

## 💚 _Maintainers_

Developed and maintained by [_Naveed Azhar_](https://github.com/imrofayel) and the _open source community_.
