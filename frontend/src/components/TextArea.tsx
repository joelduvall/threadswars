'use client';

import React, { ChangeEvent, ChangeEventHandler } from 'react'

export default function TextArea({ formFieldName, placeholder, onChange }: { formFieldName: string, placeholder: string, onChange: ChangeEventHandler }) {

  const onChangeWrapper = (e: ChangeEvent<HTMLTextAreaElement>) => { 
    if ((e.target.parentNode as HTMLElement).dataset) {
      (e.target.parentNode as HTMLElement).dataset.clonedVal = e.target.value 
    }
    onChange(e);
  }

    return (
      <div className="grid text-sm after:px-3.5 after:py-1.5 [&>textarea]:text-inherit after:text-inhert [&>textarea]:resize-none [&>textarea]:overflow-hidden [&>textarea]:[grid-area:1/1/2/2] after:[grid-area:1/1/2/2] after:whitespace-pre-wrap after:invisible after:content-[attr(data-cloned-val)_'_'] after:border" data-cloned-val="asdasd">
        <textarea name={formFieldName} maxLength={250} className="w-full text-foreground bg-transparent border border-none appearance-none rounded-lg px-3.5 py-1.5 outline-none focus:bg-transparent focus:border-none " id="message" onChange={ onChangeWrapper }  placeholder={placeholder} required></textarea>
      </div>
    )
}

//(e) => { if ((e.target.parentNode as HTMLElement).dataset) (e.target.parentNode as HTMLElement).dataset.clonedVal = e.target.value }}