import { OpenAI } from "openai";

export async function generateEmbedding({
  openai,
  text,
}: {
  openai: OpenAI;
  text: string;
}) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null; // Return null or handle as needed
  }
}

export function getPregnantDuration(date: Date) {
  const today = new Date();
  const lmp = date;
  const years = today.getFullYear() - lmp.getFullYear();
  const months = today.getMonth() - lmp.getMonth();
  return `${years * 12 + months} bulan`;
}

// export function useAnimatedText({
//   text,
//   delimiter,
// }: {
//   text: string;
//   delimiter: string;
// }) {
//   let animatedCursor = useMotionValue(0);
//   let [cursor, setCursor] = useState(0);
//   let [prevText, setPrevText] = useState(text);
//   let [isSameText, setIsSameText] = useState(true);

//   if (prevText !== text) {
//     setPrevText(text);
//     setIsSameText(text.startsWith(prevText));

//     if (!text.startsWith(prevText)) {
//       setCursor(0);
//     }
//   }

//   useEffect(() => {
//     if (!isSameText) {
//       animatedCursor.jump(0);
//     }

//     let controls = animate(animatedCursor, text.split(delimiter).length, {
//       duration: 3,
//       ease: "easeOut",
//       onUpdate(latest) {
//         setCursor(Math.floor(latest));
//       },
//     });

//     return () => controls.stop();
//   }, [animatedCursor, isSameText, text]);

//   return text.split(delimiter).slice(0, cursor).join(delimiter);
// }
