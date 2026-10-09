// components/GalleryModal.tsx
import React from 'react'
import { X } from 'lucide-react';

import rulesRpsImage from '@/assets/images/image-rules.svg'
import rulesRpslsImage from '@/assets/images/image-rules-bonus.svg'

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from './ui/button';

type ModalProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  rps: boolean;
};

export default function RulesModal({
  isOpen,
  setOpen,
  children,
  rps
}: ModalProps) {
  return (

    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="
          [&>button]:hidden 
          p-0! 
          grid 
          justify-center 
          place-content-center 
          bg-transparent 
          border-none
        "
      >
        {/*
          [&>button]:hidden explanation:

          - DialogContent from shadcn/ui automatically renders
            a default close button inside it.

          - [&>button]:hidden means:
              '&' = this element (DialogContent)
              '>button' = any direct child button
              'hidden' = display: none

          - So this hides the built-in close button,
            because we are creating our own custom close button below.
        */}

        {/* Hidden text for accessibility (screen readers) */}
        <span className="sr-only">rules</span>
        
        {/* Modal body */}
        <div className='flex flex-col gap-4 bg-white p-4 rounded-md'>
          
          {/* Header */}
          <div className='flex justify-between'>
            <h2 className='text-dark-text font-bold text-2xl uppercase'>
              Rules
            </h2>

            {/* Custom close button */}
            <Button 
              size={"icon"} 
              variant={"ghost"} 
              onClick={() => setOpen(false)}
            >
              <X className='text-header-outline size-8' />
            </Button>
          </div>

          <img 
            src={rps ? rulesRpsImage : rulesRpslsImage} 
            alt="rules" 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
