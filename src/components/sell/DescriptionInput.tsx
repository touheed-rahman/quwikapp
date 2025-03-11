
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  category?: string;
  title?: string;
}

const DescriptionInput = ({ value, onChange, category, title }: DescriptionInputProps) => {
  const maxLength = 2000;
  const [seoScore, setSeoScore] = useState(0);
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [seoTips, setSeoTips] = useState<string[]>([]);
  
  // Generate category-specific keyword suggestions
  useEffect(() => {
    if (!category) {
      setKeywordSuggestions([
        'condition', 'features', 'brand', 'color', 'size', 
        'dimensions', 'quality', 'material', 'original', 'authentic'
      ]);
      return;
    }
    
    const categoryKeywords: Record<string, string[]> = {
      'electronics': [
        'specifications', 'features', 'warranty', 'condition', 'original', 
        'authentic', 'working condition', 'damage', 'screen', 'battery'
      ],
      'mobiles': [
        'storage', 'ram', 'camera', 'screen size', 'battery life', 
        'processor', 'condition', 'warranty', 'accessories', 'original'
      ],
      'vehicles': [
        'mileage', 'kilometers', 'fuel type', 'transmission', 'insurance', 
        'service history', 'ownership', 'registration', 'condition', 'features'
      ],
      'furniture': [
        'material', 'dimensions', 'color', 'condition', 'assembly', 
        'weight', 'style', 'comfortable', 'storage', 'quality'
      ],
      'fashion': [
        'material', 'size', 'color', 'condition', 'brand', 
        'authentic', 'occasion', 'style', 'measurements', 'original'
      ],
      'property': [
        'area', 'location', 'bedrooms', 'bathrooms', 'amenities', 
        'parking', 'floor', 'furnished', 'maintenance', 'security'
      ]
    };
    
    setKeywordSuggestions(categoryKeywords[category.toLowerCase()] || categoryKeywords.electronics);
  }, [category]);
  
  // Check keyword density and provide SEO tips
  useEffect(() => {
    if (!value || value.length < 10) {
      setSeoScore(0);
      setSeoTips(['Write a detailed description with key product features']);
      return;
    }
    
    let score = 0;
    const tips: string[] = [];
    const wordCount = value.split(/\s+/).length;
    
    // Length assessment
    if (wordCount < 30) {
      score += 1;
      tips.push('Aim for at least 50-100 words for better visibility');
    } else if (wordCount < 50) {
      score += 2;
      tips.push('Good start, but aim for 100+ words for optimal results');
    } else if (wordCount < 100) {
      score += 3;
    } else {
      score += 4;
    }
    
    // Keyword inclusion
    const valueLower = value.toLowerCase();
    let keywordsFound = 0;
    const missingKeywords: string[] = [];
    
    keywordSuggestions.forEach(keyword => {
      if (valueLower.includes(keyword.toLowerCase())) {
        keywordsFound++;
      } else {
        missingKeywords.push(keyword);
      }
    });
    
    // Add points based on keyword diversity
    score += Math.min(keywordsFound, 5);
    
    if (keywordsFound < 3) {
      const suggestedKeywords = missingKeywords.slice(0, 3);
      tips.push(`Consider mentioning: ${suggestedKeywords.join(', ')}`);
    }
    
    // Structure assessment
    if (!value.includes('\n')) {
      tips.push('Use paragraphs to structure your description better');
    }
    
    // Check for numerical specifics (good for SEO)
    const hasNumbers = /\d+/.test(value);
    if (!hasNumbers) {
      tips.push('Include specific numbers (dimensions, age, specifications)');
    } else {
      score += 1;
    }
    
    // Title-description coherence
    if (title && title.length > 0) {
      const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const titleWordsInDesc = titleWords.filter(word => valueLower.includes(word.toLowerCase()));
      
      if (titleWordsInDesc.length < Math.min(2, titleWords.length)) {
        tips.push('Include key terms from your title in your description');
      } else {
        score += 1;
      }
    }
    
    // Normalize to 0-100
    setSeoScore(Math.min(Math.round((score / 11) * 100), 100));
    setSeoTips(tips);
  }, [value, keywordSuggestions, title]);
  
  return (
    <motion.div 
      className="space-y-2.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <label className="text-sm font-medium block flex items-center">
        <FileText className="h-4 w-4 mr-1.5 text-primary" />
        Description *
      </label>
      <div className="relative">
        <Textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Include condition, features and reason for selling. Be detailed and use keywords that buyers might search for."
          className="min-h-[150px] resize-none border-primary/20 focus-visible:ring-primary/30 shadow-sm transition-all duration-200"
          maxLength={maxLength}
          required
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Be detailed and keyword-rich for better search visibility
          </p>
          {value.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs">SEO Score:</span>
              <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${seoScore > 70 ? 'bg-green-500' : seoScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${seoScore}%` }}
                />
              </div>
              <span className="text-xs font-medium">{seoScore}%</span>
            </div>
          )}
        </div>
        
        {value.length > 0 && (
          <motion.div 
            className="bg-primary/5 rounded-md p-2.5 text-xs"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-medium text-primary">SEO Recommendations:</p>
            
            {seoTips.length > 0 && (
              <ul className="mt-1 space-y-1 list-disc list-inside text-foreground/80">
                {seoTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            )}
            
            <div className="mt-2">
              <p className="font-medium mt-2">Suggested keywords to include:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {keywordSuggestions.slice(0, 8).map((keyword, index) => (
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

export default DescriptionInput;
