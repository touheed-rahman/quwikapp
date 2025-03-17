
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

type TabViewProps = {
  children: React.ReactNode;
}

const TabView = ({ children }: TabViewProps) => {
  const [activeTab, setActiveTab] = useState("classified");

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 pt-4">
        <Tabs defaultValue="classified" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="classified" className="font-medium">
              Quwik Classified
            </TabsTrigger>
            <TabsTrigger value="services" className="font-medium">
              Service Now
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
};

export default TabView;
