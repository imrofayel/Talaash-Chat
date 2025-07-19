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
			const code = `%%{init: {
  "flowchart": {
    "htmlLabels": false,
    "wrap": true,
    "nodeSpacing": 50,
    "rankSpacing": 40
  },
  "theme": "default",
  "themeVariables": {
    "fontFamily": "Geist",
    "fontSize": "23mpx",
    "primaryColor": "#f5f5f5",
    "primaryTextColor": "#222",
    "primaryBorderColor": "#7c3aed",
    "lineColor": "#000",
    "textWrapPadding": 40
  }
}}%%\n${chart.trim()}`;

			(async () => {
				try {
					const { svg } = await mermaid.render(id, code);
					ref.current!.innerHTML = svg;
				} catch (e) {
					const { svg } = await mermaid.render(id, fallback);
					ref.current!.innerHTML = svg;
				}
			})();
		}
	}, [chart]);

	return <div className="mermaid scale-85" ref={ref} />;
}
