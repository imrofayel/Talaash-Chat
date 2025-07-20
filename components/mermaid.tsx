/** biome-ignore-all lint/style/noNonNullAssertion: <> */
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false });

export function Mermaid({ chart }: { chart: string }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) {
			const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

			const fallback = `
                graph TD;
                A[Loading];
            `;

			// Always prepend hand-drawn config
			const code = `---
config:
  theme: 'default'
  look: 'handDrawn'
  themeVariables:
    mainBkg: '#ffffff'
---\n${chart.trim()}`;

			(async () => {
				try {
					const { svg } = await mermaid.render(id, code);
					ref.current!.innerHTML = svg;
					// biome-ignore lint/correctness/noUnusedVariables: <>
				} catch (e) {
					const { svg } = await mermaid.render(id, fallback);
					ref.current!.innerHTML = svg;
				}
			})();
		}
	}, [chart]);

	return <div className="mermaid scale-85" ref={ref} />;
}
