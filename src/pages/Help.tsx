
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <Card className="max-w-2xl mx-auto mt-8">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <Construction className="h-16 w-16 text-primary" />
            <h1 className="text-2xl font-bold">Help Center</h1>
            <p className="text-muted-foreground">
              We are still under development, and enhancing everyday
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Help;

