const modelIconMap: {
	keyword: string;
	icon: { light: string; dark: string };
}[] = [
	{
		keyword: "google",
		icon: {
			light: "https://svgl.app/library/google.svg",
			dark: "https://svgl.app/library/google.svg",
		},
	},
	{
		keyword: "deepseek",
		icon: {
			light: "https://svgl.app/library/deepseek.svg",
			dark: "https://svgl.app/library/deepseek.svg",
		},
	},
	{
		keyword: "meta",
		icon: {
			light: "https://svgl.app/library/meta.svg",
			dark: "https://svgl.app/library/meta.svg",
		},
	},
	{
		keyword: "mistral",
		icon: {
			light: "https://svgl.app/library/mistral-ai_logo.svg",
			dark: "https://svgl.app/library/mistral-ai_logo.svg",
		},
	},
	{
		keyword: "claude",
		icon: {
			light: "https://svgl.app/library/claude-ai-icon.svg",
			dark: "https://svgl.app/library/claude-ai-icon.svg",
		},
	},
	{
		keyword: "open",
		icon: {
			light: "https://svgl.app/library/openai.svg",
			dark: "https://svgl.app/library/openai_dark.svg",
		},
	},
	{
		keyword: "qwen",
		icon: {
			light: "https://svgl.app/library/qwen_light.svg",
			dark: "https://svgl.app/library/qwen_dark.svg",
		},
	},
	{
		keyword: "talaash",
		icon: {
			light: "https://svgl.app/library/mistral-ai_logo.svg",
			dark: "https://svgl.app/library/mistral-ai_logo.svg",
		},
	},
];

export function getModelIcon(modelName: string, theme: string): string {
	const entry = modelIconMap.find(({ keyword }) =>
		modelName.toLowerCase().includes(keyword),
	);
	return (
		entry?.icon?.[theme] ||
		(theme === "dark"
			? "https://svgl.app/library/openrouter_dark.svg"
			: "https://svgl.app/library/openrouter_light.svg")
	);
}
