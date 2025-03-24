// import { AppSidebar } from "@/components/app-sidebar";
import { ChatInput } from "@/components/widgets/chat-input";
import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <div className="h-screen w-[90%] sm:w-[60%] relative mx-auto items-center !pb-4 flex flex-col">
      {/* <AppSidebar /> */}
      {/* <ChatHero/> */}
      <Chat />
      <ChatInput />
    </div>
  );
}
