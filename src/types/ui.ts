// src/types/ui.ts
import type { ReactNode } from "react";

// Button 컴포넌트 props
export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

// Input 컴포넌트 props
export interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  type?: string;
}

// Select 컴포넌트 props
export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

export interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export interface SelectContentProps {
  children: ReactNode;
}

export interface SelectItemProps {
  value: string;
  children: ReactNode;
}

export interface SelectValueProps {
  placeholder?: string;
}

// Checkbox 컴포넌트 props
export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

// Badge 컴포넌트 props
export interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}
