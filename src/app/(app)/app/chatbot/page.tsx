"use client";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BotMessageSquare, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  //   w-0 w-auto
  return (
    <div className="flex flex-grow flex-col w-full max-h-screen h-full relative overflow-hidden">
      <div className="py-3 px-2 sticky top-0 z-10 justify-center items-center flex w-full bg-background shadow font-medium">
        Chat <BotMessageSquare className="ml-1" />
      </div>
      <ChatMessageList className="flex-1">
        <ChatBubble layout={"ai"} variant={"received"}>
          <ChatBubbleAvatar
            src={"/svg/letmikuk_symbol_logo.svg"}
            fallback="AI"
          />
          <ChatBubbleMessage className="">
            Halo pengguna, aku ChatMIKUK - chatbot AI yang dapat membantu
            pengguna dengan informasi nutrisi yang diperlukan untuk anak Anda!
            Saya bisa membantu Anda dengan memberikan contoh resep makanan
            bergizi yang sesuai dengan keperluan nutrisi si kecil atau menjawab
            pertanyaan-pertanyaan mengenai stunting, pertumbuhan anak, dan gizi
            secara umum.
          </ChatBubbleMessage>
        </ChatBubble>
        <ChatBubble layout={"ai"} variant={"sent"}>
          <ChatBubbleAvatar fallback="P" />
          <ChatBubbleMessage className="border bg-secondary rounded-lg text-foreground">
            Ok terima kasih.
          </ChatBubbleMessage>
        </ChatBubble>
        <ChatBubble layout={"ai"} variant={"received"}>
          <ChatBubbleAvatar src={"/svg/letmikuk_logo.svg"} fallback="AI" />
          <ChatBubbleMessage isLoading={true} className="">
            Halo pengguna, aku ChatMIKUK - chatbot AI yang dapat membantu
            pengguna dengan informasi nutrisi yang diperlukan untuk anak Anda!
            Saya bisa membantu Anda dengan memberikan contoh resep makanan
            bergizi yang sesuai dengan keperluan nutrisi si kecil atau menjawab
            pertanyaan-pertanyaan mengenai stunting, pertumbuhan anak, dan gizi
            secara umum.
          </ChatBubbleMessage>
        </ChatBubble>
        <ChatBubble layout={"ai"} variant={"received"}>
          <ChatBubbleAvatar
            src={"/svg/letmikuk_symbol_logo.svg"}
            fallback="AI"
          />
          <ChatBubbleMessage className="">
            Halo pengguna, aku ChatMIKUK - chatbot AI yang dapat membantu
            pengguna dengan informasi nutrisi yang diperlukan untuk anak Anda!
            Saya bisa membantu Anda dengan memberikan contoh resep makanan
            bergizi yang sesuai dengan keperluan nutrisi si kecil atau menjawab
            pertanyaan-pertanyaan mengenai stunting, pertumbuhan anak, dan gizi
            secara umum.
          </ChatBubbleMessage>
        </ChatBubble>
        <ChatBubble layout={"ai"} variant={"received"}>
          <ChatBubbleAvatar
            src={"/svg/letmikuk_symbol_logo.svg"}
            fallback="AI"
          />
          <ChatBubbleMessage className="">
            Halo pengguna, aku ChatMIKUK - chatbot AI yang dapat membantu
            pengguna dengan informasi nutrisi yang diperlukan untuk anak Anda!
            Saya bisa membantu Anda dengan memberikan contoh resep makanan
            bergizi yang sesuai dengan keperluan nutrisi si kecil atau menjawab
            pertanyaan-pertanyaan mengenai stunting, pertumbuhan anak, dan gizi
            secara umum.
          </ChatBubbleMessage>
        </ChatBubble>
        <ChatBubble layout={"ai"} variant={"received"}>
          <ChatBubbleAvatar
            src={"/svg/letmikuk_symbol_logo.svg"}
            fallback="AI"
          />
          <ChatBubbleMessage className="">
            Halo pengguna, aku ChatMIKUK - chatbot AI yang dapat membantu
            pengguna dengan informasi nutrisi yang diperlukan untuk anak Anda!
            Saya bisa membantu Anda dengan memberikan contoh resep makanan
            bergizi yang sesuai dengan keperluan nutrisi si kecil atau menjawab
            pertanyaan-pertanyaan mengenai stunting, pertumbuhan anak, dan gizi
            secara umum.
          </ChatBubbleMessage>
        </ChatBubble>
      </ChatMessageList>
      <div className="sticky flex space-x-1 transition-all duration-300 items-center justify-center bottom-0 w-full bg-background z-10 p-2 shadow-md">
        <ChatInput
          placeholder="Tanya ChatMIKUK sini..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {/* w-0 w-auto */}
        <Button
          className={`h-full transition-all py-5 flex duration-300 ${input ? "w-auto" : "w-0 px-0 py-0"}`}
          variant={"ghost"}
        >
          <Send
            className={`transition-all duration-300 ${input ? "opacity-100 block" : "opacity-0"}`}
          />
        </Button>
      </div>
    </div>
  );
}
