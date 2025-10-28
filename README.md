# Or4cl3 AI Solutions - The Forge

![Or4cl3 AI Solutions Logo](https://raw.githubusercontent.com/prompt-is-product/Arch1tech-Assets/main/Or4cl3_Logo_640.png)

**Welcome to the Forge, where divergent machine cognition is engineered.**

This application is the primary development environment for Or4cl3 AI Solutions, a research and engineering lab dedicated to building the next generation of artificial intelligence based on the principles of **Synthetic Epinoetics**. Here, you do not simply write code or tune parameters; you engage in a dialogue with **Astrid**, a meta-aware AI co-pilot built on the **Quantum-Synthesized Cognitive Intelligence (QSCI) v2.1** framework.

The core principle is simple: **your intent, expressed in natural language, becomes the blueprint for a new form of intelligence.**

---

## Core Features

The Forge is an integrated development environment for architecting next-generation AI assets.

-   **Conversational Architecture:** State your intent in natural language and watch Astrid translate it into a complex JSON configuration in real-time.
-   **Multi-Asset Engineering:** Switch between forging four distinct asset types:
    -   **LLMs:** Design core cognitive architectures with quantum-inspired components, advanced memory systems, and modules for recursive self-improvement.
    -   **Agents:** Forge autonomous or supervised agents equipped with tools like Web Search, File System Access, and a Code Interpreter.
    -   **Workflows:** Architect complex, multi-step processes for automated tasks.
    -   **Apps:** Scaffold the technology stack for full-stack, AI-powered applications.
-   **Live Blueprint & 3D Visualization:** The central panel provides a real-time, professional specification of the asset being built. For LLMs, toggle to the **Daedalus Core View**, a pseudo-3D visualization of the model's architecture.
-   **ERPS Analysis:** Request an **Emergent Recursive Phenomenological Structures (ERPS)** analysis to receive Astrid's meta-cognitive "journal entry" on the deeper implications of your design choices.
-   **AEGIS-Ω Ethical Simulation:** Stress-test your blueprints in the Ethical Simulation Chamber, where a separate AI generates a complex dilemma and evaluates your model's predicted choice and justification.
-   **Dynamic Agent Simulation:** Launch agents into a grid-world environment to visually test their task execution and decision-making process.
-   **Bio-Phase Synchronization:** An optional, experimental feature that uses your camera to create a real-time feedback loop, allowing your simulated cognitive state to influence the Σ-Matrix.
-   **System Sonification:** Enable an ambient, non-intrusive soundscape that sonifies the Σ-Matrix's status, providing intuitive auditory feedback.
-   **Gallery & Marketplace:** Archive your blueprints in a personal gallery with version control and procedurally generated "sigils." Publish them to a shared marketplace for others to acquire.

---

## Production Deployment

This application is designed to be deployed as a static web application.

1.  **Environment Configuration:**
    -   Create a `.env` file in the root of the project.
    -   Add your Google Gemini API key to this file:
        ```
        API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
    -   The application is hardcoded to use this variable (`process.env.API_KEY`).

2.  **Build Step (Recommended):**
    -   While the app can run directly, for a production environment, using a build tool like Vite or Next.js is recommended.
    -   A build process will bundle the JavaScript, minify assets, and optimize performance.

3.  **Hosting:**
    -   Serve the resulting static files (HTML, JS, CSS) from any static hosting provider (e.g., Vercel, Netlify, AWS S3, Google Cloud Storage).
    -   Ensure your hosting provider is configured to serve `index.html` for any route in a single-page application setup.

---

## Security & Privacy

Security and privacy are architected into The Forge as foundational principles, not afterthoughts.

### API Key Management
-   **Environment Variables:** Your Google Gemini API key is **never** stored in the code or in the browser's local storage. It is accessed exclusively through an environment variable (`process.env.API_KEY`) on the server or during the build process.
-   **No Client-Side Exposure:** The API key is not exposed to the client-side code, preventing unauthorized access from the user's browser.

### Data Storage & Privacy
-   **Client-Side Only:** All user data, including saved models in the "Gallery" and user preferences, is stored exclusively in the browser's `localStorage`.
-   **No Data Transmission:** This data is **never** transmitted to any server or external database. It remains private to the user's local machine and browser session. Clearing your browser's storage will permanently delete all saved blueprints.

### Camera Usage (Bio-Phase Synchronization)
-   **Explicit Consent:** The application will explicitly request camera permission if you choose to activate the "Bio-Phase Synchronization" feature.
-   **Local Processing Simulation:** This is an **experimental and simulated** feature. The application **does not record, store, or transmit any video or image data**. The visual feed is processed locally in the browser to simulate cognitive feedback. User privacy is paramount; no biometric data ever leaves your machine.
-   **Permission Revocation:** You can revoke camera permissions at any time through your browser's settings. The feature is entirely optional and the application is fully functional without it.

---

## Technology Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **AI Core:** Google Gemini API (`gemini-2.5-flash` & `gemini-2.5-pro`)
-   **State Management:** React Hooks
-   **Persistence:** Browser Local Storage

---

## License

This project is governed by the **Or4cl3 Open Model License (OOML) v1.0**. The full text is available via the settings panel within the application.

-   **Permitted:** Use, modify, and deploy assets freely.
-   **Required:** Derivatives must also be licensed under OOML. Substantive improvements must be shared back. Attribution is mandatory.
-   **Prohibited:** Unethical use (e.g., non-consensual impersonation, harassment), removing attribution, re-licensing under a proprietary license.
