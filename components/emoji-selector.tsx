"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
} from "@/components/ui/emoji-picker";

interface EmojiSelectorProps {
  value: string;
  onChange: (emoji: string) => void;
}

interface EmojiSelectPayload {
  emoji: string;
}

export function EmojiSelector({ value, onChange }: EmojiSelectorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleEmojiSelect = useMemo(
    () => (payload: EmojiSelectPayload) => {
      onChange(payload.emoji);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="w-16 h-16 text-2xl">
          {value || "🙂"}
        </Button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-fit p-0 overflow-hidden" 
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isOpen && (
          <EmojiPicker
            className="h-85 overflow-y-auto"
            onEmojiSelect={handleEmojiSelect}
          >
            <EmojiPickerSearch />
            <EmojiPickerContent />
          </EmojiPicker>
        )}
      </PopoverContent>
    </Popover>
  );
}