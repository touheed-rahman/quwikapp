
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";

type TabViewProps = {
  children: React.ReactNode;
  defaultTab?: string;
  tabs: {
    id: string;
    label: string;
  }[];
}

const TabView = ({ children, defaultTab = "classified", tabs }: TabViewProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 pt-4">
        <Tabs 
          defaultValue={defaultTab} 
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 p-1.5 rounded-full bg-muted/80 backdrop-blur-sm border border-primary/10 shadow-sm shadow-primary/5">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="rounded-full py-3.5 px-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-semibold relative overflow-hidden"
              >
                <span className="relative z-10">{tab.label}</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 rounded-full"
                  initial={{ x: tab.id === "classified" ? "-100%" : "100%" }}
                  animate={{ x: activeTab === tab.id ? 0 : tab.id === "classified" ? "-100%" : "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </TabsTrigger>
            ))}
          </TabsList>
          
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "classified" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
};

export default TabView;
