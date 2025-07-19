import type * as React from "react";

import { SearchForm } from "@/components/search-form";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props} variant="floating" className="!p-1.5">
			<SidebarHeader>
				<div className="flex justify-end items-center">
					<SidebarTrigger />
				</div>

				<SearchForm />
			</SidebarHeader>
			<SidebarContent className="gap-0">
				{/* We create a collapsible SidebarGroup for each parent. */}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
