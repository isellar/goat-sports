
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full mb-6 border border-slate-200 rounded-md shadow-sm"
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100">
          <h3 className="font-semibold">{title}</h3>
          <div className="p-1 h-8 w-8 flex items-center justify-center">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleSection;
