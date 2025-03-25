"use client";

import { useState } from "react";
import Together from "together-ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        width: 1024,
        height: 1056,
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
  };

  const openImageDialog = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleDownload = () => {
    if (!selectedImage) return;

    const canvas = document.createElement("canvas");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "ai-generated-image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);
        setSelectedImage(null);
      }, "image/png");
    };
    img.src = selectedImage;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">AI Image Generator</h1>

      <div className="flex gap-4 mb-8">
        <Input
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1"
        />
        <Button onClick={generateImages} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Images"
          )}
        </Button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={index} className="p-4">
              <img
                src={imageUrl}
                alt={`Generated image ${index + 1}`}
                className="w-full h-auto mb-4 rounded-lg"
                onClick={() => openImageDialog(imageUrl)}
              />
            </Card>
          ))}
        </div>
      )}

      {/* Download Confirmation Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <img
              src={selectedImage || ""}
              alt="Selected AI-generated image"
              className="max-w-full h-auto mb-4 rounded-lg"
            />
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
