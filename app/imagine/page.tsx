"use client";

import { useState } from "react";
import Together from "together-ai";
import { Button } from "@/components/ui/button";
import { Square, ArrowUp } from "lucide-react";
import Link from "next/link";
import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");

  const generateImages = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const together = new Together({
        apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
      });

      const response = await together.images.create({
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt: prompt,
        width: 1440,
        height: 1440,
        steps: 4,
        n: 1,
        response_format: "url",
      });

      if (response.data && response.data[0]?.url) {
        const imageUrl = response.data[0].url;
        setImages([imageUrl]);
      } else {
        setError("No image data received from the API");
        console.error("API Response:", response);
      }
    } catch (err) {
      setError("Failed to generate images. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }

    setPrompt("");
  };

  const handleValueChange = (value: string) => {
    setPrompt(value);
  };

  return (
    <div className="h-screen w-[97%] md:w-[60%] relative mx-auto items-center !pb-4 flex flex-col">
      <h1 className="italic text-4xl fraunces w-full flex justify-between pt-6 sm:fixed left-8 items-center select-none sm:px-0 px-4 pb-3">
        <span>Imagine Raya!</span>

        <Link href="https://github.com/imrofayel">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            viewBox="0 0 24 24"
            className="sm:fixed right-8 top-5 cursor-pointer !z-[100]"
          >
            <path
              fill="currentColor"
              d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
            />
          </svg>
        </Link>
      </h1>

      <div className="md:w-[65%] w-[97%] absolute bottom-4 flex flex-col justify-center items-center z-20">
        <PromptInput
          value={prompt}
          onValueChange={handleValueChange}
          onSubmit={generateImages}
          className="relative flex h-full border cursor-text bg-[#fcf8f2] w-full justify-center items-center transition-all duration-500 focus-within:shadow-none hover:shadow-none rounded-[30px]"
        >
          <PromptInputTextarea
            placeholder="Imagine with Raya!"
            className="t-body-chat block w-full resize-none overflow-y-hidden whitespace-pre-wrap bg-transparent text-primary-700 outline-none placeholder:opacity-100 !border-none placeholder:text-[#c4b7a4] placeholder:!text-[26px] placeholder:italic italic !text-[26px]"
            rows={2}
          />

          <Button
            size="icon"
            aria-label="Generate"
            className={cn(
              "rounded-full transition-all duration-600 shadow-none font-semibold !text-gray-950 disabled:opacity-100",
              loading ? "[&_svg]:!size-5 bg-[#faf3ea] hover:bg-[#faf3ea]" : "[&_svg]:!size-5.5",

              prompt.trim() === ""
                ? "bg-[#faf3ea] !text-black/80"
                : "bg-[#038247] hover:bg-[#038247] !text-white"
            )}
            onClick={generateImages}
            disabled={loading && !prompt.trim()}
          >
            {loading ? <Square className="[&_svg]:!size-5" /> : <ArrowUp />}
          </Button>
        </PromptInput>
      </div>

      {images.length === 0 && (
        <div className="flex flex-col gap-3 w-full h-[200px] items-center justify-center">
          <p className="text-center text-4xl text-muted-foreground fraunces">
            Create images with Raya
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="flex w-full h-full items-center justify-center px-3">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative">
              <Image
                width={1440}
                height={1440}
                src={imageUrl}
                alt={`Generated image ${index + 1}`}
                className="w-[410px] h-auto mb-4 drop-shadow-xs rounded-3xl"
              />

              <Link href={imageUrl} target="_blank" rel="noopener noreferrer">
                <button
                  className="rounded-xl bg-black/80  p-2 max-h-fit hover:bg-black/80 top-3 right-3 absolute text-white"
                  title="Download"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" viewBox="0 0 24 24">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5l5-5m-5 5V3"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
