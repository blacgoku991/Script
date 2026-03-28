import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-300">
            {label}
            {props.required && <span className="text-amber-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-gray-500',
            'bg-white/4 border border-amber-500/20',
            'focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10',
            'transition-all duration-200',
            error && 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/10',
            className
          )}
          style={{ background: 'rgba(255,255,255,0.04)' }}
          {...props}
        />
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-300">
            {label}
            {props.required && <span className="text-amber-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-gray-500',
            'bg-white/4 border border-amber-500/20',
            'focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10',
            'transition-all duration-200 resize-y min-h-24',
            error && 'border-red-500/60',
            className
          )}
          style={{ background: 'rgba(255,255,255,0.04)' }}
          {...props}
        />
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-300">
            {label}
            {props.required && <span className="text-amber-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg text-sm text-white',
            'border border-amber-500/20',
            'focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10',
            'transition-all duration-200',
            className
          )}
          style={{ background: 'rgba(20,20,20,0.95)' }}
          {...props}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
