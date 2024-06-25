/**
 * Represents the a component responsible for creating a new thread.
 *
 * @component
 * @param {Props} props - The component props.
 * @param {IUser} props.user - The user object.
 * @returns {JSX.Element} The rendered QuickPost component.
 */
"use client";

import React, { useActionState, useMemo, useRef, useState } from 'react'
import ProfileLink from './ProfileLink'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { IUser, getUserDisplayName } from '@/models/user'
import TextArea from './TextArea'
import addThread from '@/app/add-thread'
import { ZodIssue } from 'zod'
import { useFormState } from 'react-dom'
import { Images, X } from 'lucide-react';
import { Button } from './ui/button';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import Image from 'next/image';
import { toast } from 'sonner';
import Thread from './Thread';

type QuickPostProps = {
  user: IUser;
};

export default function QuickPost({ user }: QuickPostProps ) {

  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [open, setOpen] = useState(false);
  const [invalidOrProcessing, setInValidOrProcessing] = useState(true);
  const [state, formAction] = useFormState(handleSubmit, null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  //const [preview, setPreview] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [currentFiles, setCurrentFiles] = useState<File[] | null>(null);

  /**
   * Handles when the text input field changes. Used to expand the text area dynamically 
   * but also set wether the thread is valid or not.
   * @param e - The event object. 
   */
  const onThreadFieldChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(e.target.textLength > 0) {
      if (invalidOrProcessing === true)
        setInValidOrProcessing(false);
    }
    else {  
      if (invalidOrProcessing === false)
        setInValidOrProcessing(true);
    }
  }

  /**
   * Handles submission of the new thread form disables submit butting, adds thread, closes the dialog.
   * @param prevState 
   * @param formData 
   * const promise = handlePostAction(formData);
          toast.promise(promise, {
            loading: "Creating post...",
            success: "Post created!",
            error: (e) => "Error creating post: " + e.message,
          });
   */
  async function handleSubmit (prevState: any, formData: any) {
    setInValidOrProcessing(true);
    // sleep running thread for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await addThread(prevState, formData);
    setOpen(false);
    setCurrentFiles(null);
    toast.success("Thread created!");
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    // if no files are selected return
    if (!e.target.files) {
      return;
    }

    // add files from e in currentFiles state where the files does not already exist
    setCurrentFiles(() => {
      const dataTransfer = new DataTransfer();
      
      //add each current file to the dataTransfer files
      for (const file of currentFiles || []) {
        dataTransfer.items.add(file);
      }

      for (const file of Array.from(e.target.files || [])) {
        if (!currentFiles?.find((f) => f.name === file.name)) {
          dataTransfer.items.add(file);
        }
      }
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
      }
      
      return  Array.from(dataTransfer.files);
    });


    // // create an list for storing strings
    // const files: string[] | null = [];

    // // for each file in the target files push the url of the file to the files list
    // for (const file of Array.from(e.target.files || [])) {
    //   //const url = URL.createObjectURL(file);
    //   files.push(file);
    // }
    
    // setCurrentFiles(dataTransfer.files);       

    setInValidOrProcessing(false);

  };

  const handleClick = (index: number) => {
    return;
    // if (!mainApi || !thumbnailApi) {
    //   return;
    // }
    // thumbnailApi.scrollTo(index);
    // mainApi.scrollTo(index);
    // setCurrent(index);
  };

  

  const previewImages = useMemo(
    () => {
      const handleRemoveImageClick = (index: number) => {
        // remove image from preview
    
        const currentFilesArray: File[] = currentFiles || [];
        const newPreview: File[] | null = [...currentFilesArray ];
        newPreview.splice(index, 1);
        setCurrentFiles(newPreview);
        if (newPreview.length === 0) {
          setInValidOrProcessing(true);
        }
    
      }

      
      return currentFiles?.map((image, index) => (
        <CarouselItem
          key={index} 
          className="relative  object-contain"
           
          style={{ '--maxHeight': '430px', '--aspectRatio': 344 / 430, 'max-height': 'var(--maxHeight)', 'max-width': '344px',
            'aspect-ratio': 'var(--aspectRatio)', 'flexBasis': "unset"} as React.CSSProperties}
          onClick={() => handleClick(index)}
        >
          <Image
            className="border-2"
            src={URL.createObjectURL(image)}
            height={430}
            width={344}
            sizes="(max-width: 344px) calc(100vw - 24px), 320px"
            alt={`Carousel Thumbnail Image ${index + 1}`}
            style={{ objectFit: "cover", height: "unset" }}
          />
          <div style={{ display: 'block', position: 'absolute', top: '10px', right: '10px'  } }>
            <Button
              type='button'
              variant="ghost" size="icon"
              className="flex h-8 w-8"       
              onClick={() => handleRemoveImageClick(index)}                
            >
              <X />
            </Button>
          </div>
        </CarouselItem>
      ))},
    [currentFiles],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="block">
            <div className="flex pt-4 pb-4" >
                <ProfileLink username={ getUserDisplayName(user) }/>
                <div className='flex flex-grow items-center ml-2 mr-2 mt-0 mb-0 touch-manipulation bg-transparent cursor-text pl-1 ' >
                    <span className="max-w-max overflow-y-visible overflow-x-visible text-left break-words block cursor-text relative secondary-text">Start a thread ...</span>
                </div>
                <div className='flex-shrink block'> 
                    <div className="post-button">
                      <div className="pl-4 pr-4 overflow-x-hidden overflow-y-hidden overflow-ellipsis justify-center text-black font" >Post</div>
                    </div>
                </div>
            </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          {/* -------------------------------------------------------------------- */}
          {/* <threaderer>  | <username> <is validated> <time Since posted>        */}
          {/* <User AVATAR> |         <content>                                    */}
          {/* <chil link>   |         <content>                                    */}
          {/* <indicator>   |         <content>                                    */}
          {/* <indicator>   |         <footer>                                     */}
          {/* -------------------------------------------------------------------- */}

          <div className='thread-grid'>
            <div className="threaderer-cell" > {/* Row 1,2 col1 */}
              <Avatar>
                <AvatarImage src={ user.avatar } alt={ getUserDisplayName(user) } />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>     
        
              <input type="hidden" name="parentThreadId" value="" />
            </div> 
            <div className='threaderer-name-cell'> {/* Row 1 col2 */}
              <div className="threader-info">
                <div className="flex gap-1.5 col-start-1 self-center items-baseline">
                  <span className="flex items-center flex-row">
                    <div>
                      {/* Profile Name */}
                      <span className="inline m-0 p-0 border-0 border-none bg-transparent touch-manipulation box-border overflow-visible max-w-full text-foreground font-semibold text-left break-words ">
                        { getUserDisplayName(user) }
                      </span>
                    </div>
                    <span className="mt-px ml-1">
                        {/* Status icon */}
                        {/* <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="rgb(0, 149, 246);" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          
                          <path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"></path>
                        </svg> */}
                        {/* <svg role="img" viewBox="0 0 40 40" fill="rgb(0, 149, 246);" style="--fill: rgb(0, 149, 246); --height: 12px; --width:12px; height:var(--height, revert); width: var(--width, revert);fill: var(--fill, revert); position: relative; display:block; fillrule:evenodd;">
                          <path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"></path>
                        </svg> */}

                      {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(0, 149, 246);" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="verified">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 16 16 12 8 12"></polyline>
                      </svg> */}

                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className='thread-link-indicators-cell'> {/* Row 3,4 col1  -- Thread Link Indicators Cell ---*/}
              {/* thread connectors to replies */}
              <div style={{ 'height':'100%', 'width':'100%', 'position':'relative', 'display':'block', 'paddingTop':'10px', 'paddingBottom':'0', 'boxSizing':'border-box' }}>
                { false &&
                  <div className='block absolute top-2.5 bottom-0' style={{ 'left':'calc(50% - 1px);'}}>
                    <div className='thread-connector block absolute  w-0.5 h-full rounded-sm' style= {{ 'backgroundColor': 'rgb(51, 54, 56)'}}></div>
                  </div> 
                }
              </div>
            </div>
            <div className='thread-content-cell'> {/* Row 2,3,4 col2 --- Thread Content --- */}
              <div>
                <div className='thread-text-content'>
                  <TextArea formFieldName='content' placeholder='Start Your Thread Here...' onChange={ onThreadFieldChanged }></TextArea>
                </div>
                <div>
                  {/* Preview */}
                  {currentFiles && (
                    <div>
                    <Carousel setApi={setMainApi} opts={{ align: "start"}} className='w-full max-w-s'>
                      <CarouselContent className="m-1">{previewImages}</CarouselContent>
                    </Carousel>
                    {/* <Carousel setApi={setThumbnailApi}>
                      <CarouselContent className="m-1">{thumbnailImages}</CarouselContent>
                    </Carousel> */}
                    {/* // <div className='flex items-center h-8 -ml-2 mt-1'>
                    //   <img src={preview} alt="Preview" className="w-8 h-8 object-cover" />
                    //   <Button
                    //     type='button'
                    //     variant="ghost" size="icon"
                    //     className="flex h-8 w-8"
                    //     onClick={() => setPreview(null)}
                    //   >
                    //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(0, 149, 246);" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    //       <line x1="18" y1="6" x2="6" y2="18"></line>
                    //       <line x1="6" y1="6" x2="18" y2="18"></line>
                    //     </svg>
                    //   </Button>
                    // </div> */}
                    </div>
                  )}

                </div>             
                <div className='flex items-center h-8 -ml-2 mt-1'> 
                    <Button
                      type='button'
                      variant="ghost" size="icon"
                      className="flex h-8 w-8"
                      
                      onClick={() => fileInputRef.current?.click()}                
                    >
                      <Images />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="images"
                      accept="image/jpeg,image/png,video/mp4,video/quicktime"
                      hidden
                      onChange={handleImageChange}
                      multiple
                    />
                </div>
              </div>
              
            </div>

            <div className='thread-footer-cell'> {/* Row 5 col2  --- Thread Footer Options --- */}
              <div className="flex ">
                <div className='flex flex-grow items-center ml-2 mr-2 mt-0 mb-0 touch-manipulation bg-transparent cursor-text pl-1'>
                    <span></span>
                </div>
                <div className="flex flex-shrink">                
                  <button type='submit' className="post-button" disabled={invalidOrProcessing}>
                    <span className="pl-4 pr-4 overflow-x-hidden overflow-y-hidden overflow-ellipsis justify-center text-black font">Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
