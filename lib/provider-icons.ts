const modelIconMap: { keyword: string; icon: string }[] = [
	{ keyword: "google", icon: "https://svgl.app/library/google.svg" },
	{ keyword: "deepseek", icon: "https://svgl.app/library/deepseek.svg" },
	{ keyword: "meta", icon: "https://svgl.app/library/meta.svg" },
	{ keyword: "mistral", icon: "https://svgl.app/library/mistral-ai_logo.svg" },
	{ keyword: "claude", icon: "https://svgl.app/library/claude-ai-icon.svg" },
	{ keyword: "open", icon: "https://svgl.app/library/openai.svg" },
	{ keyword: "qwen", icon: "https://svgl.app/library/qwen_light.svg" },
	{ keyword: "talaash", icon: "https://svgl.app/library/deepseek.svg" },
];

export function getModelIcon(modelName: string): string {
	const entry = modelIconMap.find(({ keyword }) =>
		modelName.toLowerCase().includes(keyword),
	);
	return entry?.icon || "https://svgl.app/library/openrouter_light.svg";
}
