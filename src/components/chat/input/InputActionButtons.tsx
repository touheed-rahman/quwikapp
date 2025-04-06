
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image, Smile, Mic } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import QuickResponseTemplates from "./QuickResponseTemplates";

interface InputActionButtonsProps {
  disabled: boolean;
  isSending: boolean;
  isRecording: boolean;
  onMicToggle: () => void;
  onSelectTemplate: (template: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const InputActionButtons = ({ 
  disabled, 
  isSending, 
  isRecording,
  onMicToggle,
  onSelectTemplate,
  fileInputRef
}: InputActionButtonsProps) => {
  return (
    <>
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
                disabled={disabled || isSending}
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
              disabled={disabled || isSending}
            >
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="font-medium text-sm mb-2">Quick Responses</div>
            <Separator className="my-1.5" />
            <QuickResponseTemplates onSelectTemplate={onSelectTemplate} />
          </PopoverContent>
        </Popover>
      </div>

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
                onClick={onMicToggle}
                disabled={disabled || isSending}
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
    </>
  );
};

export default InputActionButtons;
