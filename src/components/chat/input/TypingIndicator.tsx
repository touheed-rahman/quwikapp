
interface TypingIndicatorProps {
  isTyping: boolean;
}

const TypingIndicator = ({ isTyping }: TypingIndicatorProps) => {
  if (!isTyping) return null;
  
  return (
    <div className="text-xs text-primary animate-pulse mb-2 ml-2">
      Someone is typing...
    </div>
  );
};

export default TypingIndicator;
