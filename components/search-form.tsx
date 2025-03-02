import { Search } from "lucide-react";

import { Label } from "@/components/ui/label";
import { SidebarGroup, SidebarGroupContent, SidebarInput } from "@/components/ui/sidebar";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <SidebarGroup className="py-2 px-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder=""
            className="pl-8 placeholder:text-white/65 bg-[#252725] placeholder:text-md !py-[17px]"
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4.5 -translate-y-1/2 opacity-65 select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
