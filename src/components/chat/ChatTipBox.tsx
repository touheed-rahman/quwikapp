
import { MessageCircle } from "lucide-react";

const ChatTipBox = () => {
  return (
    <div className="bg-blue-50 p-4 m-3 rounded-lg flex items-start gap-3">
      <div className="bg-blue-500 rounded-full p-2 text-white">
        <MessageCircle className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-medium text-gray-800">Chat to know more!</h3>
        <p className="text-sm text-gray-600">
          Close the deal faster by asking more about the product or person.
        </p>
      </div>
    </div>
  );
};

export default ChatTipBox;
