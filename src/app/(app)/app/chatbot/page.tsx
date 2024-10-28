"use client";
import GradientAIBarsContainer from "@/app/components/GradientAIBarsContainer";
import GradientText from "@/app/components/GradientText";
import Sparkle from "@/app/components/svg/Sparkle";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { BotMessageSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { useAnimatedText } from "@/lib/effects";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Halo pengguna, aku ChatMIKUK - chatbot AI yang dapat membantu pengguna dengan informasi nutrisi yang diperlukan untuk anak Anda! Saya bisa membantu Anda dengan memberikan contoh resep makanan bergizi yang sesuai dengan keperluan nutrisi si kecil atau menjawab pertanyaan-pertanyaan mengenai stunting, pertumbuhan anak, dan gizi secara umum.",
    },
    {
      sender: "user",
      text: "Ok. Terima kasih",
    },

    {
      sender: "ai",
      text: `Berikut adalah rencana makan sehat untuk anak berumur 7 tahun, yang mencakup sarapan, makan siang, dan makan malam selama satu hari. Semua menu dirancang dengan memperhatikan nilai gizi yang baik dan bahan-bahan yang terjangkau.

### Rencana Makan Sehari

#### Sarapan:
**Bubur Ayam**
- **Deskripsi**: Bubur yang lembut dan gurih ini kaya akan karbohidrat dari beras dan protein dari ayam, sangat cocok untuk memulai hari anak dengan baik.
- **Bahan**:
  - 100 gr beras
  - 50 gr dada ayam, direbus dan disuwir
  - 1 siung bawang putih, cincang halus
  - 2 sdm kecap manis
  - 1 sdt minyak goreng
  - Daun bawang secukupnya untuk taburan
- **Cara Membuat**:
  1. Cuci beras, masak dengan air hingga menjadi bubur.
  2. Tumis bawang putih dengan minyak hingga harum, lalu tambahkan suwiran ayam dan kecap manis.
  3. Sajikan bubur dengan ayam di atasnya, taburi dengan daun bawang.

#### Makan Siang:
**Capcay Ayam**
- **Deskripsi**: Sayuran segar yang ditumis dengan daging ayam, penuh warna dan bergizi tinggi.
- **Bahan**:
  - 100 gr dada ayam, potong dadu
  - 1/2 cangkir brokoli, potong
  - 1/2 cangkir wortel, iris tipis
  - 1/2 cangkir jagung manis
  - 1 siung bawang putih, cincang
  - 1 sdm saus tiram
  - 1 sdm minyak goreng
- **Cara Membuat**:
  1. Tumis bawang putih dengan minyak hingga harum.
  2. Masukkan ayam, tumis hingga matang.
  3. Tambahkan sayuran brokoli, wortel, dan jagung. Tambahkan saus tiram dan masak hingga sayuran layu.

**Nasi Putih**
- Sajikan capcay dengan nasi putih.

#### Makan Malam:
**Lontong Sayur**
- **Deskripsi**: Lontong yang disajikan dengan sayur bersantan ini sangat lezat dan memberikan energi menjelang malam.
- **Bahan**:
  - 2 potong lontong (bisa menggunakan lontong instan)
  - 1/2 cangkir sayur labu siam, potong dadu
  - 1/2 cangkir sayur kacang panjang, potong kecil
  - 1/2 cangkir santan kelapa
  - 1 sdt bumbu rempah (bisa menggunakan bumbu siap pakai)
  - Garam secukupnya
- **Cara Membuat**:
  1. Didihkan santan, lalu masukkan semua sayuran dan bumbu rempah.
  2. Masak hingga sayuran empuk dan santan mendidih.
  3. Sajikan sayur santan dengan potongan lontong.

### Camilan Sehat (Opsional):
- **Buah Potong** (pisang, apel, atau jeruk)
- **Susu** (pilih susu rendah lemak atau susu kedelai)

### Anggaran:
Rencana makan ini menggunakan bahan-bahan yang umum dan mudah didapat di pasar tradisional atau supermarket, dengan anggaran yang terjangkau untuk keluarga Indonesia. Pastikan untuk membeli bahan-bahan dalam jumlah yang sesuai agar lebih hemat.

Semoga rencana makan ini bermanfaat untuk anak Anda!`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Ref for the ChatMessageList to scroll
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to bottom when new messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!input || loading) return; // Prevent sending if loading or input is empty

    // Add the user's message to the list
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input field
    setLoading(true); // Set loading state
    console.log("loading:", loading);
    // Add a placeholder for AI's loading message
    const aiLoadingMessage = {
      sender: "ai",
      text: "", // Text will be replaced later
    };
    setMessages((prev) => [...prev, aiLoadingMessage]);

    // setTimeout(() => {
    //   // Update the last message with actual AI response
    //   setMessages((prev) => {
    //     const updatedMessages = [...prev];
    //     updatedMessages[updatedMessages.length - 1] = {
    //       sender: "ai",
    //       text: "Ini adalah balasan AI berdasarkan masukan Anda.",
    //     };
    //     return updatedMessages;
    //   });
    //   setLoading(false);
    //   console.log("loading:", loading);
    // }, 5000); // simulate response delay

    // try {
    const response: any = await fetch("/api/generate/app/nutrition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value || new Uint8Array(), { stream: true });
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1].text += chunk;
        return updatedMessages;
      });
      console.log("last message text:", messages[messages.length - 1].text);
    }
    setLoading(false);
  };

  // Animates the text of the last message if AI is typing
  const lastMessage = messages[messages.length - 1];
  const animatedText =
    useAnimatedText(lastMessage?.sender === "ai" ? lastMessage.text : "") || "";

  //   w-0 w-auto
  return (
    <div className="flex flex-grow flex-col w-full max-h-screen h-full relative overflow-hidden">
      <div className="py-3 px-2 sticky top-0 z-10 justify-center items-center flex w-full bg-background shadow font-medium">
        Chat <BotMessageSquare className="ml-1" />
      </div>
      <ChatMessageList className="min-h-[200px] flex-1">
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            layout="ai"
            variant={message.sender === "ai" ? "received" : "sent"}
          >
            {message.sender === "ai" &&
            loading &&
            index === messages.length - 1 ? (
              // Render loading indicator with fade-in animation
              <div className="flex space-x-2 animate-fade-in">
                <Sparkle className="animate-spin" />
                <GradientText speed={3} text="Membuat tanggapan..." />
              </div>
            ) : (
              // Render the avatar for non-loading messages
              <ChatBubbleAvatar
                src={
                  message.sender === "ai"
                    ? "/svg/letmikuk_symbol_logo.svg"
                    : "/path/to/user/avatar.svg"
                }
                fallback={message.sender === "ai" ? "AI" : "P"}
              />
            )}

            <ChatBubbleMessage
              className={`${
                message.sender === "ai" ? "" : "bg-secondary ml-2 rounded-lg"
              } ${loading && index === messages.length - 1 ? "animate-fade-in" : ""}`}
            >
              {loading &&
              index === messages.length - 1 &&
              message.sender === "ai" ? (
                <div className="w-full animate-fade-in">
                  <GradientAIBarsContainer barCount={5} />
                </div>
              ) : (
                <Markdown className="text-foreground animate-fade-in">
                  {index === messages.length - 1 && loading
                    ? animatedText
                    : message.text}
                </Markdown>
              )}
            </ChatBubbleMessage>
          </ChatBubble>
        ))}

        <div ref={messagesEndRef} />
      </ChatMessageList>
      <div className="sticky flex space-x-1 transition-all duration-300 items-center justify-center bottom-0 w-full bg-background z-10 p-2 shadow-md">
        <ChatInput
          placeholder="Tanya ChatMIKUK sini..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading} // Disable input while loading
        />
        {/* w-0 w-auto */}
        <Button
          className={`h-full transition-all py-5 flex duration-300 ${input ? "w-auto" : "w-0 px-0 py-0"}`}
          variant={"ghost"}
          onClick={handleSendMessage}
        >
          <Send
            className={`transition-all duration-300 ${input ? "opacity-100 block" : "opacity-0"}`}
          />
        </Button>
      </div>
    </div>
  );
}
