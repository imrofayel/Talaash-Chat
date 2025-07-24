"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	const toggleTheme = useCallback(() => {
		setTheme(theme === "light" ? "dark" : "light");
		console.log(theme);
	}, [theme, setTheme]);

	return (
		<button
			type="button"
			className="cursor-pointer dark:opacity-85"
			onClick={toggleTheme}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="26px"
				viewBox="0 0 24 24"
				className="dark:rotate-180"
			>
				<title>Theme Switcher</title>
				<path
					fill="currentColor"
					d="M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709m.497-1.017q3.09-.202 5.295-2.459T20 12t-2.185-5.505T12.5 4.017z"
				/>
			</svg>
		</button>
	);
}
