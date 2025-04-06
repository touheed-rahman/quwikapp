
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Image, X, Paperclip, Smile, Mic, MapPin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSend: () => void;
  disabled?: boolean;
  disabledReason?: string;
  onImageUpload?: (file: File) => void;
  isTyping?: boolean;
}

const ChatInput = ({ 
  newMessage, 
  setNewMessage, 
  handleSend, 
  disabled, 
  disabledReason,
  onImageUpload,
  isTyping
}: ChatInputProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);
  
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

  const handleMicToggle = () => {
    // This is a placeholder for voice recording functionality
    setIsRecording(!isRecording);
  };
  
  const renderQuickTemplates = () => {
    const templates = [
      "Is this still available?",
      "What's your best price?",
      "Where are you located?",
      "Can I see more photos?",
      "When can we meet?",
      "Can you deliver?",
      "What's the condition?",
      "How long have you had this?"
    ];
    
    return (
      <div className="grid grid-cols-2 gap-2 p-1">
        {templates.map((template, idx) => (
          <Button 
            key={idx}
            variant="ghost" 
            size="sm"
            className="h-auto py-1.5 justify-start text-left text-sm font-normal"
            onClick={() => setNewMessage(template)}
          >
            {template}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-3 bg-white border-t">
      {isTyping && (
        <div className="text-xs text-primary animate-pulse mb-2 ml-2">
          Someone is typing...
        </div>
      )}
      
      {disabledReason && (
        <div className="text-center text-muted-foreground mb-2 text-sm bg-muted/30 py-1.5 rounded-md">
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
          <Button 
            onClick={handleClearImage}
            variant="secondary"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 bg-white rounded-full shadow-md"
          >
            <X className="h-3 w-3 text-gray-600" />
          </Button>
        </div>
      )}
      
      <div className="flex items-center gap-2 max-w-4xl mx-auto relative">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        <div className="flex items-center space-x-1 absolute left-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary transition-colors h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                >
                  <Image className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send an image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary transition-colors h-8 w-8"
                disabled={disabled}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="font-medium text-sm mb-2">Quick Responses</div>
              <Separator className="my-1.5" />
              {renderQuickTemplates()}
            </PopoverContent>
          </Popover>
        </div>
        
        <Input
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className={cn(
            "flex-1 focus-visible:ring-primary/50 pl-16 pr-10",
            isRecording && "bg-red-50 animate-pulse"
          )}
          onKeyDown={(e) => e.key === "Enter" && !disabled && handleSubmit()}
          disabled={disabled}
        />
        
        <div className="absolute right-12">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "text-muted-foreground hover:text-primary transition-colors h-8 w-8",
                    isRecording && "text-red-500"
                  )}
                  onClick={handleMicToggle}
                  disabled={disabled}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRecording ? 'Stop recording' : 'Voice message'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={disabled || (!newMessage.trim() && !selectedFile)}
          className="bg-primary hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
