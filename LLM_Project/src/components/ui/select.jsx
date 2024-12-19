import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

export const Select = ({ children, onValueChange }) => {
  return (
    <SelectPrimitive.Root onValueChange={onValueChange}>
      {children}
    </SelectPrimitive.Root>
  );
};

export const SelectTrigger = ({ children, className }) => {
  return (
    <SelectPrimitive.Trigger
      className={`border rounded px-4 py-2 ${className}`}
    >
      {children}
    </SelectPrimitive.Trigger>
  );
};

export const SelectValue = ({ placeholder }) => {
  return <SelectPrimitive.Value placeholder={placeholder} />;
};

export const SelectContent = ({ children }) => {
  return (
    <SelectPrimitive.Content className="border rounded shadow-md">
      {children}
    </SelectPrimitive.Content>
  );
};

export const SelectItem = ({ children, value }) => {
  return (
    <SelectPrimitive.Item
      value={value}
      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
    >
      {children}
    </SelectPrimitive.Item>
  );
};
