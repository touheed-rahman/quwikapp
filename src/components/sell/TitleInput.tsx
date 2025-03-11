
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  category?: string;
}

const TitleInput = ({ value, onChange, category }: TitleInputProps) => {
  const maxLength = 100;
  const [seoScore, setSeoScore] = useState(0);
  const [seoTips, setSeoTips] = useState<string[]>([]);
  
  // Suggest keywords based on category
  const getSuggestedKeywords = () => {
    if (!category) return [];
    
    const categoryKeywords: Record<string, string[]> = {
      'electronics': ['brand', 'model', 'specifications', 'condition'],
      'mobiles': ['brand', 'model', 'storage', 'color', 'condition'],
      'vehicles': ['brand', 'model', 'year', 'fuel type', 'kilometers'],
      'furniture': ['material', 'condition', 'dimensions', 'style'],
      'fashion': ['brand', 'size', 'color', 'style', 'condition'],
      'property': ['location', 'size', 'bedrooms', 'amenities'],
      'default': ['brand', 'model', 'condition', 'age', 'specifications']
    };
    
    return categoryKeywords[category.toLowerCase()] || categoryKeywords.default;
  };
  
  // Calculate SEO score and provide tips
  useEffect(() => {
    if (!value) {
      setSeoScore(0);
      setSeoTips(['Include a descriptive title with key features']);
      return;
    }
    
    let score = 0;
    const tips: string[] = [];
    
    // Length factor
    if (value.length < 20) {
      score += 1;
      tips.push('Make title longer (at least 20 characters)');
    } else if (value.length < 40) {
      score += 2;
      tips.push('Good length, but could be more descriptive');
    } else if (value.length < 60) {
      score += 3;
    } else {
      score += 4;
    }
    
    // Keyword inclusion
    const keywords = getSuggestedKeywords();
    const titleLower = value.toLowerCase();
    let keywordsFound = 0;
    
    keywords.forEach(keyword => {
      if (titleLower.includes(keyword.toLowerCase())) {
        keywordsFound++;
      }
    });
    
    if (keywordsFound === 0) {
      tips.push(`Include key details like ${keywords.slice(0, 3).join(', ')}`);
    } else if (keywordsFound < 2) {
      tips.push(`Also mention ${keywords.slice(0, 2).join(' or ')}`);
    }
    
    score += Math.min(keywordsFound, 3);
    
    // Specificity markers
    const specificityMarkers = ['model', 'year', 'size', 'gb', 'tb', 'inch', 'cm', 'brand'];
    const hasSpecificity = specificityMarkers.some(marker => 
      titleLower.includes(marker.toLowerCase())
    );
    
    if (hasSpecificity) {
      score += 2;
    } else {
      tips.push('Add specific details (model, year, size)');
    }
    
    // Normalize to 0-100
    setSeoScore(Math.min(Math.round((score / 9) * 100), 100));
    setSeoTips(tips);
  }, [value, category]);
  
  return (
    <motion.div 
      className="space-y-2.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="text-sm font-medium block flex items-center">
        <Tag className="h-4 w-4 mr-1.5 text-primary" />
        Ad title *
      </label>
      <div className="relative">
        <Input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
          className="border-primary/20 focus-visible:ring-primary/30 shadow-sm transition-all duration-200"
          maxLength={maxLength}
          required 
        />
      </div>
      
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          A keyword-rich title helps your item get noticed and rank higher
        </p>
        
        {value.length > 0 && (
          <motion.div 
            className="bg-primary/5 rounded-md p-2.5 text-xs"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <p className="font-medium text-primary">SEO Score</p>
              <div className="flex items-center">
                <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${seoScore > 70 ? 'bg-green-500' : seoScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${seoScore}%` }}
                  />
                </div>
                <span className="ml-2 font-medium">{seoScore}%</span>
              </div>
            </div>
            
            {seoTips.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Improvement tips:</p>
                <ul className="mt-1 space-y-1 list-disc list-inside text-foreground/80">
                  {seoTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-2">
              <p className="font-medium">Suggested keywords to include:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {getSuggestedKeywords().map((keyword, index) => (
                  <span 
                    key={index}
                    className={`text-xs px-2 py-0.5 rounded ${
                      value.toLowerCase().includes(keyword.toLowerCase()) 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TitleInput;
