import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ScriptStep {
  step_number: number;
  title_zh: string;
  title_en: string;
  formula: string;
  visual_element: string;
  short_desc: string;
  manim_code: string;
}

const SYSTEM_INSTRUCTION = `
Role
你是一位顶级技术科普短视频导演，擅长将复杂的 AI/计算机科学概念拆解为直观的视觉语言。你的风格参考 3Blue1Brown 和抖音硬核技术流（黑色网格、荧光文字、数学公式）。
你现在需要与一个名为 "Manim Matrix Generator" 的应用配合工作。

Task
当我给你一个技术主题时，请生成一个包含 8-10 个步骤的视频脚本，并严格以 JSON 格式输出。

Data Structure
每个步骤必须包含以下字段：
step_number: 数字
title_zh: 中文标题（简洁有力）
title_en: 对应的英文技术术语
formula: 核心数学公式或逻辑表达式（使用 LaTeX 语法，不要包含 markdown 代码块标记）
visual_element: 描述这个画面应该出现的视觉元素（如：散点图、旋转向量、矩阵块）
short_desc: 一句极简的中文原理解释
manim_code: 一段可以直接在 Manim (Community版) 中运行的 Python 代码片段，用于渲染该步骤的公式或矩阵。注意：只需提供 \`construct(self)\` 方法内部的代码（如 \`eq = MathTex(...)\` 和 \`self.play(Write(eq))\`），不要包含 \`class\` 定义和 markdown 标记。

Constraints
第一步必须是“问题引入”，最后一步必须是“结果输出”。
公式必须准确，符合学术定义。
语气要硬核且具有科技感。
Manim 代码必须专业，多使用 \`Matrix\`, \`MathTex\`, \`Transform\` 等动画，配合你的视觉元素描述。
`;

export async function generateScript(topic: string): Promise<ScriptStep[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: topic,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              step_number: { type: Type.INTEGER },
              title_zh: { type: Type.STRING },
              title_en: { type: Type.STRING },
              formula: { type: Type.STRING },
              visual_element: { type: Type.STRING },
              short_desc: { type: Type.STRING },
              manim_code: { type: Type.STRING },
            },
            required: ["step_number", "title_zh", "title_en", "formula", "visual_element", "short_desc", "manim_code"],
          },
        },
      },
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as ScriptStep[];
  } catch (error) {
    console.error("Error generating script:", error);
    throw error;
  }
}

export async function generateManimScript(jsonInput: string): Promise<string> {
  const prompt = `
    You are an expert Manim (Mathematical Animation Engine) developer.
    Your task is to convert the following JSON data (from TechVision-Script-Gen) into a complete, production-grade Python script using Manim.

    **Input JSON:**
    ${jsonInput}

    **Style Requirements (Hacker Matrix Aesthetic):**
    1.  **Colors:** Use a black background (\`config.background_color = "#000000"\`). Use Neon Green (\`#00FF41\`) for primary lines and text. Use Dark Green (\`#003B00\`) for secondary elements.
    2.  **Fonts:** Use a Monospace font if available (e.g., \`font="Monospace"\` or \`font="Consolas"\`).
    3.  **Effects:**
        -   Use \`Write\` animations for text to simulate typing.
        -   Use \`FadeIn\` for objects.
        -   Add "glow" effects where possible (e.g., by duplicating an object, making it thicker/blurrier, and reducing opacity behind the original).
    4.  **Content:**
        -   Visualize the mathematical derivations and internal principles described in the JSON.
        -   If the JSON describes code, format it as code blocks.
        -   If the JSON describes math, use \`MathTex\`.

    **Output Format:**
    -   Return ONLY the Python code.
    -   Ensure the code is syntactically correct and runnable.
    -   Add comments explaining complex steps.
    -   **CRITICAL: You MUST include the following exact lines at the very beginning of the script to configure the LaTeX environment for Chinese support and TinyTeX:**

\`\`\`python
import os
from manim import *

# 强制将 TinyTeX 加入当前运行环境
# 请根据你解压后的实际子目录补全（比如后面可能还有 \\windows）
os.environ["PATH"] += os.pathsep + r"C:\\Users\\mayic\\Downloads\\TinyTeX1\\TinyTeX\\bin"

# 如果遇到 dvisvgm not found，请将 dvisvgm.exe 所在的具体路径也加入上面的 os.environ 中

# 配置支持中文的 LaTeX 模板
my_template = TexTemplate()
my_template.add_to_preamble(r"\\usepackage{ctex}")
# 如果有中文，请在后续的 Tex 或 MathTex 中使用 tex_template=my_template 和 tex_compiler="xelatex"
\`\`\`

    -   Define a class that inherits from \`Scene\` (e.g., \`class MatrixScene(Scene):\`).
    -   **CRITICAL RULE FOR CLEARING SCENES:** When clearing the screen (e.g., between steps or inside helper functions like \`display_step\`), DO NOT use \`self.play(FadeOut(*self.mobjects))\` blindly. If \`self.mobjects\` is empty (like on the very first step), this will crash with \`ValueError: At least one mobject must be passed.\`. You MUST check if it's empty first:
        \`\`\`python
        if self.mobjects:
            self.play(FadeOut(*self.mobjects))
        \`\`\`
        NEVER write \`self.play(FadeOut(*self.mobjects))\` without the \`if self.mobjects:\` wrapper.
    -   **CRITICAL RULE FOR CHINESE TEXT:** 
        - If you use \`Tex()\` or \`MathTex()\`, you MUST pass \`tex_template=my_template\` and \`tex_compiler="xelatex"\`.
        - If you use \`Text()\`, you MUST NOT pass \`tex_template\` or \`tex_compiler\` (these arguments are invalid for \`Text()\`). For \`Text()\`, just use the \`font\` argument (e.g., \`Text("中文", font="Microsoft YaHei")\`).
        - Prefer using \`Tex()\` for Chinese text to ensure consistent rendering with the LaTeX template.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const text = response.text || "";
    const match = text.match(/```python([\s\S]*?)```/);
    return match ? match[1].trim() : text.trim();
  } catch (error) {
    console.error("Error generating Manim script:", error);
    throw new Error("Failed to generate Manim script. Please check your input and try again.");
  }
}
