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
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        className="p-5 [&>button]:hidden bg-transparent border-none shadow-none grid place-content-center"
      >
        {/* Hidden title and description for accessibility */}
        <span className="sr-only">rules</span>
        
        <div className='max-w-[400px] flex flex-col gap-4 
        bg-white p-4 rounded-md '
        >
          <div className='flex justify-between'>
            <h2 className='text-dark-text font-bold text-2xl uppercase'>Rules</h2>

            <Button 
              size={"icon"} 
              variant={"ghost"} 
              onClick={() => setOpen(false)}
            >
              <X className='text-header-outline size-8' />
            </Button>
          </div>

          <img src={rps ? rulesRpsImage : rulesRpslsImage} alt="rules" />
        </div>
      </DialogContent>
    </Dialog>
  );
}