// import { AppSidebar } from "@/components/app-sidebar";
import { ChatInput } from "@/components/widgets/chat-input";
import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <div className="h-screen w-[97%] sm:w-[60%] relative mx-auto items-center !pb-4 flex flex-col">
      <h1 className="italic text-4xl fraunces w-full flex justify-start pt-6 sm:fixed left-8 -z-10 select-none sm:px-0 px-4">
        Raya
      </h1>
      {/* <AppSidebar /> */}
      {/* <ChatHero/> */}
      <Chat />
      <ChatInput />
    </div>
  );
}
