// components/AppUIPeeker.tsx
import type React from "react";

export const AppUIPeeker: React.FC = () => (
	<div className="mt-8 flex justify-center">
		{/* Simulated model picker */}
		<div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm">
			<div className="i-hugeicons:robot w-5 h-5 text-primary" />
			<span className="font-medium">Llama 3 8B</span>
			<div className="i-hugeicons:chevron-down w-4 h-4 text-muted-foreground" />
		</div>
	</div>
);
