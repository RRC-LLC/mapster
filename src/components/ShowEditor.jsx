'use client'
import { useRef, useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useForm, useFieldArray, Controller } from "react-hook-form"
import ReCAPTCHA from "react-google-recaptcha"
import { submitShowEditorData, verifyReCAPTCHA } from "@/actions/actions"
import { MdDragIndicator, MdDeleteForever, MdAdd } from "react-icons/md";
import { motion } from "framer-motion";

export default function ShowEditor({ showId, type, content, closeModal }) {
    const [isClosing, setIsClosing] = useState(false);
    const [showRecaptcha, setShowRecaptcha] = useState(false);

    let recaptchaRef = useRef()

    const handleClose = () => {
        setIsClosing(true);
    };

    useEffect(() => {
        if (isClosing) {
            setShowRecaptcha(false);
            closeModal();
            return;
        }

        const timer = setTimeout(() => {
            setShowRecaptcha(true);
        }, 200);

        return () => clearTimeout(timer);
    }, [isClosing]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsClosing(true);
        }
    };


    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful }
    } = useForm({
        defaultValues: {
          content: content.map((item, i) => { 
            if (type == 'setlist') {
              return { name: item.title } 
            } else {
              return { name: item.name } 
          }})
        }
    })

    const { fields, append, move, remove } = useFieldArray({
        control,
        name: "content"
    });

    const handleDrag = ({ source, destination }) => {
        if (destination) {
          move(source.index, destination.index);
        }
    };

    const onSubmit = async (data) => {
        
        try {
            const token = await recaptchaRef.current.executeAsync()
            const success = await verifyReCAPTCHA(token)
            if (!success) throw Error('unsuccessful recaptcha verification')
        } catch (e) {
            setError('root.recaptchaError', { type: 'recaptcha' })
            return
        }

        try {
            let array = type == 'setlist' ?
              data.content.map((song) => {
                return {
                  name: song.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
                }
              }) :
              data.content
            
            await submitShowEditorData({
                showId,
                type,
                array
            })
        } catch (e) {
            setError('root.serverError', { type: 'server' })
            return
        }

        setTimeout(closeModal, 2000)
        
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-[100000] flex items-center justify-center top-0 left-0 w-full h-full bg-black bg-opacity-60"
            onClick={handleBackdropClick}
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="wood-shadow wood-550 max-w-[95vw] min-w-[288px] rounded flex justify-center my-24 p-2 py-1 max-h-[60vh]"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="z-[500] flex w-full items-center flex-col gap-1">
                    <div className="flex px-2 text-xl font-pg w-full text-trail-yellow justify-between">
                        <h1 className="">edit {type}</h1>
                        <div className="cursor-pointer" onClick={handleClose}>x</div>
                    </div>

                    <section className="relative flex w-full p-6 rounded-sm shadow-inner-show bg-gray-2 overflow-scroll flex-grow flex-col">
                        <DragDropContext onDragEnd={handleDrag}>
                            <ul>
                                <Droppable droppableId="content-items">
                                    {(provided, snapshot) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {fields.map((item, index) => {
                                                return (
                                                    <Draggable
                                                        key={`content[${index}]`}
                                                        draggableId={`content-${index}`}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <li
                                                                key={item.id}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className="flex drop-shadow gap-0 w-min"
                                                            >
                                                                <div
                                                                    className="w-min bg-dark-blue my-1"
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        width: "35%"
                                                                    }}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <MdDragIndicator/>
                                                                </div>
                                                                <input
                                                                    className="bg-light-blue text-black px-2 py-1 my-1"
                                                                    defaultValue={`${item.name}`} // make sure to set up defaultValue
                                                                    {...register(`content.${index}.name`)}
                                                                />
                                                                <button type="button" title="delete"className="text-cream opacity-50 hover:opacity-100 transition-opacity duration-150 ease ml-2 text-lg" onClick={() => remove(index)}><MdDeleteForever/></button>
                                                            </li>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}

                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </ul>
                        </DragDropContext>

                        <button
                            type="button"
                            className="flex w-24 text-sm mt-2 text-cream opacity-50 hover:opacity-100 transition-opacity duration-150 ease items-center gap-2"
                            onClick={() => {
                                append({ name: "" });
                            }}
                        >
                            <MdAdd/> add {type == 'setlist'? 'track' : 'artist'}
                        </button>
                    </section>

                    {showRecaptcha && (
                      <div className="fixed" id="recaptcha-container">
                          <Controller
                              render={({ field: { onChange, ref } }) => (
                                  <ReCAPTCHA
                                      ref={(e) => {ref(e); recaptchaRef.current = e}}
                                      size="invisible"
                                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                      onChange={onChange}
                                  />
                              )}
                              name="recaptcha"
                              control={control}
                          />
                      </div>
                  )}
                            
                    <div className="hover:brightness-110 transition-brightness duration-200 ease dark-wood-small cursor-pointer h-10 mt-1 mb-[5px] font-pg flex shadow-inner-button justify-center items-center rounded text-trail-yellow text-base sm:text-lg">
                        <input className="opacity-90 w-full h-full cursor-pointer px-4 p-1" type="submit" value="submit edit"/>
                    </div>
                    {(isSubmitting && !isSubmitted) && 
                        <div className="absolute bottom-[-36px] text-cream text-sm">Sending...</div>}
                    {(errors.root) && (errors.root.serverError) &&
                        <div className="absolute bottom-[-36px] text-cream text-sm">Error submitting. Please try again momentarily.</div>}
                    {(errors.root) && (errors.root.recaptchaError) &&
                        <div className="absolute bottom-[-36px] text-cream text-sm">Error verifying reCAPTCHA. Please try again momentarily.</div>}
                    {isSubmitSuccessful && 
                        <div className="absolute bottom-[-36px] text-cream text-sm">
                        Thank you, we&apos;ve received your submission.
                        </div>}
                </form>
            </motion.div>
        </motion.div>
    )
}