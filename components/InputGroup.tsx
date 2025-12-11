import React from 'react';
import { DollarSign } from 'lucide-react';

interface InputGroupProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  id: string;
  placeholder?: string;
  min?: number;
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  label, 
  value, 
  onChange, 
  id, 
  placeholder = "0.00",
  min = 0
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onChange(isNaN(val) ? 0 : val);
  };

  return (
    <div className="mb-5 group">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-white/80 mb-2 transition-colors group-focus-within:text-white"
      >
        {label}
      </label>
      <div className="relative rounded-xl shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <DollarSign className="h-5 w-5 text-white/50 group-focus-within:text-pink-300 transition-colors" />
        </div>
        <input
          type="number"
          name={id}
          id={id}
          min={min}
          value={value === 0 ? '' : value}
          onChange={handleChange}
          className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                     text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:bg-white/10 
                     transition-all duration-200 sm:text-sm backdrop-blur-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};