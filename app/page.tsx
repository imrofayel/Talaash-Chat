// import { AppSidebar } from "@/components/app-sidebar";
import { ChatInput } from "@/components/widgets/chat-input";
import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <div className="h-screen w-[60%] relative mx-auto !pb-4 flex flex-col">
      {/* <AppSidebar /> */}
      <Chat />
      <ChatInput />
    </div>
  );
}
