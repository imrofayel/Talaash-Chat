"use client";

import { cn } from "@/lib/utils";
import { motion, MotionProps, type AnimationProps } from "motion/react";
import React from "react";

const animationProps = {
	initial: { "--x": "100%", scale: 0.8 },
	animate: { "--x": "-100%", scale: 1 },
	whileTap: { scale: 0.95 },
	transition: {
		repeat: Infinity,
		repeatType: "loop",
		repeatDelay: 1,
		type: "spring",
		stiffness: 20,
		damping: 15,
		mass: 2,
		scale: {
			type: "spring",
			stiffness: 200,
			damping: 5,
			mass: 0.5,
		},
	},
} as AnimationProps;

interface ShinyButtonProps
	extends Omit<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			keyof MotionProps
		>,
		MotionProps {
	children: React.ReactNode;
	className?: string;
}

export const ShinyButton = React.forwardRef<
	HTMLButtonElement,
	ShinyButtonProps
>(({ children, className, disabled, ...props }, ref) => {
	return (
		<motion.button
			ref={ref}
			disabled={disabled}
			className={cn(
				"relative rounded-lg px-3 py-1.5 font-medium transition-shadow duration-300 ease-in-out flex items-center gap-2",
				disabled
					? "opacity-30 cursor-not-allowed"
					: "cursor-pointer hover:shadow",
				className,
			)}
			style={
				{
					"--primary": "#ffffff",
				} as React.CSSProperties
			}
			{...(!disabled ? animationProps : {})} // disable shine animation if disabled
			{...props}
		>
			<span
				className="relative flex items-center gap-2 text-sm uppercase tracking-wide text-black/65 dark:text-white/90"
				style={{
					WebkitMaskImage:
						"linear-gradient(-75deg,var(--primary) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),var(--primary) calc(var(--x) + 100%))",
					maskImage:
						"linear-gradient(-75deg,var(--primary) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),var(--primary) calc(var(--x) + 100%))",
				}}
			>
				{children}
			</span>

			{/* Shine overlay */}
			{!disabled && (
				<span
					style={{
						WebkitMask:
							"linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
						backgroundImage:
							"linear-gradient(-75deg,var(--primary)/5% calc(var(--x)+20%),var(--primary)/40% calc(var(--x)+25%),var(--primary)/5% calc(var(--x)+100%))",
					}}
					className="absolute inset-0 z-10 block rounded-[inherit]"
				/>
			)}
		</motion.button>
	);
});

ShinyButton.displayName = "ShinyButton";
