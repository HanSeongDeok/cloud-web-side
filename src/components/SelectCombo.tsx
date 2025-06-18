import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { memo, useState } from "react";
import "@styles/SelectCombo.css";

const SelectCombo = memo(() => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const handleSelect = (value: string) => {
    setSelectedItems(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      }
      return [...prev, value];
    });
  };

  return (
    <Select>
      <SelectTrigger className="selectTrigger">
        <SelectValue placeholder="TEST"> TEST </SelectValue>
      </SelectTrigger>
      <SelectContent className="selectContent">
        <SelectGroup>
          {[
            { value: "apple", label: "Apple" },
            { value: "banana", label: "Banana" },
            { value: "blueberry", label: "Blueberry" },
            { value: "grapes", label: "Grapes" },
            { value: "pineapple", label: "Pineapple" },
            { value: "apple2", label: "Apple2" },
            { value: "banana2", label: "Banana2" },
            { value: "blueberry2", label: "Blueberry2" },
            { value: "grapes2", label: "Grapes2" },
            { value: "pineapple2", label: "Pineapple2" },
          ].map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              onSelect={() => handleSelect(item.value)}
              className="selectItem"
            >
              <Checkbox
                checked={selectedItems.includes(item.value)}
                onCheckedChange={() => handleSelect(item.value)}
                className="checkbox"
              />
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
});

export default SelectCombo;