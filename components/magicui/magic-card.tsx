"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import React, { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps {
	children?: React.ReactNode;
	className?: string;
	gradientSize?: number;
	gradientOpacity?: number;
	gradientFrom?: string;
	gradientTo?: string;
}

export function MagicCard({
	children,
	className,
	gradientSize = 250,
	gradientOpacity = 0.8,
	gradientFrom = "rgba(16,185,129,0.6)", // emerald-500
	gradientTo = "rgba(134,239,172,0.4)", // green-300
}: MagicCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const mouseX = useMotionValue(-gradientSize);
	const mouseY = useMotionValue(-gradientSize);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (cardRef.current) {
				const { left, top } = cardRef.current.getBoundingClientRect();
				mouseX.set(e.clientX - left);
				mouseY.set(e.clientY - top);
			}
		},
		[mouseX, mouseY],
	);

	useEffect(() => {
		const node = cardRef.current;
		if (!node) return;
		node.addEventListener("mousemove", handleMouseMove);
		return () => node.removeEventListener("mousemove", handleMouseMove);
	}, [handleMouseMove]);

	return (
		<div
			ref={cardRef}
			className={cn(
				"group relative rounded-[inherit] overflow-hidden",
				className,
			)}
		>
			{/* border glow layer */}
			<motion.div
				className="absolute inset-0 rounded-[inherit] pointer-events-none"
				style={{
					background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientFrom},
              ${gradientTo},
              transparent 80%
            )
          `,
					opacity: gradientOpacity,
					filter: "blur(20px)", // ✨ makes it glowy
				}}
			/>

			{/* solid background (prevents glow bleeding into text field) */}
			<div className="absolute inset-px rounded-[inherit] bg-background" />

			{/* content */}
			<div className="relative z-10">{children}</div>
		</div>
	);
}
