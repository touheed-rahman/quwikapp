
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ImagePreview from "./input/ImagePreview";
import TypingIndicator from "./input/TypingIndicator";
import DisabledMessage from "./input/DisabledMessage";
import InputActionButtons from "./input/InputActionButtons";
import SendButton from "./input/SendButton";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSend: () => void;
  disabled?: boolean;
  disabledReason?: string;
  onImageUpload?: (file: File) => void;
  isTyping?: boolean;
  isSending?: boolean;
}

const ChatInput = ({ 
  newMessage, 
  setNewMessage, 
  handleSend, 
  disabled = false, 
  disabledReason,
  onImageUpload,
  isTyping = false,
  isSending = false
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
    if (isSending) return;
    
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
  
  const handleSelectTemplate = (template: string) => {
    setNewMessage(template);
  };

  return (
    <div className="p-3 bg-white border-t">
      <TypingIndicator isTyping={isTyping} />
      <DisabledMessage disabledReason={disabledReason} />
      
      {imagePreview && (
        <ImagePreview 
          imagePreview={imagePreview} 
          onClear={handleClearImage} 
        />
      )}
      
      <div className="flex items-center gap-2 max-w-4xl mx-auto relative">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        <InputActionButtons
          disabled={!!disabled}
          isSending={isSending}
          isRecording={isRecording}
          onMicToggle={handleMicToggle}
          onSelectTemplate={handleSelectTemplate}
          fileInputRef={fileInputRef}
        />
        
        <Input
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isSending ? "Sending..." : "Type a message..."}
          className={cn(
            "flex-1 focus-visible:ring-primary/50 pl-16 pr-10",
            isRecording && "bg-red-50 animate-pulse",
            isSending && "text-muted-foreground"
          )}
          onKeyDown={(e) => e.key === "Enter" && !disabled && !isSending && handleSubmit()}
          disabled={disabled || isSending}
        />
        
        <SendButton 
          onClick={handleSubmit}
          disabled={disabled || isSending || (!newMessage.trim() && !selectedFile)}
          isSending={isSending}
        />
      </div>
    </div>
  );
};

export default ChatInput;
