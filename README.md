# TechVision Script Gen & Manim Matrix Generator

> 🎥 **Hardcore Technical Video Script & Animation Generator**
> Powered by Gemini 2.5 Flash, React, and Manim

## ⚡ Introduction

TechVision is a specialized, end-to-end tool for technical content creators. It not only generates high-quality, 8-10 step video scripts in the style of **3Blue1Brown** or **Hardcore Tech** videos, but it also **automatically generates production-ready Manim Python code** to render those scripts into stunning mathematical animations.

Input a complex topic (e.g., "Transformer Architecture"), and get a structured timeline with:
- 🇨🇳/🇺🇸 Bilingual Titles
- 📐 Core Mathematical Formulas (LaTeX rendered)
- 🎬 Precise Visual Directives
- 🧠 Concise Explanations
- 🐍 **Full Manim Python Scene Code** (Matrix Hacker Aesthetic)

## 🛠 Features

- **AI Director Persona**: Generates scripts with a distinct "hardcore" tone.
- **Visual-First Workflow**: Each step includes specific visual element descriptions.
- **Math-Ready UI**: Built-in KaTeX rendering for complex equations in the browser.
- **Cyberpunk UI**: Glassmorphism, neon accents (`#00ff9d`), and grid backgrounds.
- **Manim Integration**: One-click generation of a complete `Scene` class in Python.
- **Chinese LaTeX Support**: Auto-configures `ctex` and `xelatex` in the generated Python code for seamless Chinese character rendering in Manim.

## 🚀 Getting Started

### Prerequisites

**For the Web App (Script Generation):**
- Node.js 18+
- A Gemini API Key

**For Rendering Animations (Local Machine):**
- Python 3.8+
- [Manim Community Edition](https://www.manim.community/) (`pip install manim`)
- LaTeX distribution (e.g., MiKTeX, TeX Live, or TinyTeX) with `ctex` package installed.

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```

## 🎬 Workflow: From Idea to Video

1. **Generate Script**: Open the web app, enter a topic (e.g., "Backpropagation"), and click **Generate**.
2. **Review**: Review the generated timeline, formulas, and visual descriptions in the UI.
3. **Generate Animation Code**: Click the **"Generate Matrix Animation"** button. The app will translate the entire script into a complete Manim Python file.
4. **Copy & Run**: Click **"Copy Python Code"**, paste it into a local file (e.g., `scene.py`), and run it using Manim:
   ```bash
   manim -pql scene.py MatrixScene
   ```

## 💻 Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4 + Framer Motion
- **AI**: Google GenAI SDK (`@google/genai`)
- **Math Rendering**: KaTeX
- **Animation Engine Target**: Manim (Python)

---

*Crafted for the next generation of tech educators.*
