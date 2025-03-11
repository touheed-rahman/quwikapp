
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Award, TrendingUp } from "lucide-react";

const WelcomeBanner = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4">
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="p-6 md:p-8 space-y-3 flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground/90">
                Welcome to <span className="text-primary">Quwik</span>
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Find what you need, or sell what you don't
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm md:text-base">Easy to Use</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Find anything with our smart search</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm md:text-base">Trusted Community</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Connect with verified sellers nearby</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm md:text-base">Quick Deals</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Chat and negotiate in real-time</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-1/3 bg-gradient-to-br from-primary/30 to-primary/10 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/10 text-[180px] font-bold transform -rotate-12">Q</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeBanner;
