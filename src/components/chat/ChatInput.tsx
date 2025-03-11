
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Image, X } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSend: () => void;
  disabled?: boolean;
  disabledReason?: string;
  onImageUpload?: (file: File) => void;
}

const ChatInput = ({ 
  newMessage, 
  setNewMessage, 
  handleSend, 
  disabled, 
  disabledReason,
  onImageUpload
}: ChatInputProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (selectedFile && onImageUpload) {
      onImageUpload(selectedFile);
      handleClearImage();
    }
    
    if (newMessage.trim()) {
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t">
      {disabledReason && (
        <div className="text-center text-muted-foreground mb-2">
          {disabledReason}
        </div>
      )}
      
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="h-20 rounded-md object-cover border border-primary/20"
          />
          <button 
            onClick={handleClearImage}
            className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )}
      
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Image className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send an image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type here"
          className="flex-1 focus-visible:ring-primary/50"
          onKeyDown={(e) => e.key === "Enter" && !disabled && handleSubmit()}
          disabled={disabled}
        />
        
        <Button 
          onClick={handleSubmit}
          disabled={disabled || (!newMessage.trim() && !selectedFile)}
          className="bg-primary hover:bg-primary/90"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
