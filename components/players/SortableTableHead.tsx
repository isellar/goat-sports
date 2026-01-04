import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface SortableTableHeadProps {
  field: string;
  currentSort: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function SortableTableHead({
  field,
  currentSort,
  sortOrder,
  onSort,
  children,
  className,
}: SortableTableHeadProps) {
  const isActive = currentSort === field;

  return (
    <TableHead
      className={cn(
        'cursor-pointer hover:bg-muted/50 transition-colors',
        className
      )}
      onClick={() => onSort(field)}
    >
      <div className={cn('flex items-center', className?.includes('text-right') ? 'justify-end' : 'justify-start')}>
        <span>{children}</span>
        {isActive ? (
          sortOrder === 'asc' ? (
            <ArrowUp className="ml-1 h-3 w-3" />
          ) : (
            <ArrowDown className="ml-1 h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
        )}
      </div>
    </TableHead>
  );
}

