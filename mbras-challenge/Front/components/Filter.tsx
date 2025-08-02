"use client";

import { LuChevronsUpDown, LuCheck } from "react-icons/lu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { DialogTitle } from "./ui/dialog";
import { Category } from "@/types/category";

type FilterProps = {
  value: string;
  onChange: (val: string) => void;
  options: Category[];
};

export default function Filter({ value, onChange, options }: FilterProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  function CommandSection() {
    return (
      <Command>
        <CommandInput placeholder="Search framework..." />
        <CommandList>
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {options.map((category) => (
              <CommandItem
                key={category.slug}
                value={category.name}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <LuCheck
                  className={`mr-2 h-4 w-4 ${
                    value === category.name ? "opacity-100" : "opacity-0"
                  }`}
                />
                {category.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? options.find((category) => category.name === value)?.name
              : "Filtre por tipo..."}
            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <CommandSection />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find((category) => category.name === value)?.name
            : "Filtre por tipo..."}
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DialogTitle className="sr-only">
          Filtro de Categorias de vagas
        </DialogTitle>
        <div className="mt-4 border-t">
          <CommandSection />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
