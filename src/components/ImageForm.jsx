'use client'
import { useState } from "react";
import { useForm, Controller } from "react-hook-form"
import { submitImageProposal, uploadImage, deleteImage, verifyReCAPTCHA } from "@/actions/actions";

export default function ImageForm({ showId, closeModal, recaptchaRef }) {
    const [termsAccepted, setTermsAccepted] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        control,
        watch,
        formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful }
    } = useForm()
    
    const onSubmit = async (data) => {

        try {
            const token = await recaptchaRef.current.executeAsync()
            const success = await verifyReCAPTCHA(token)
            if (!success) throw Error('unsuccessful recaptcha verification')
        } catch (e) {
            setError('root.recaptchaError', { type: 'recaptcha' })
            return
        }

        let imageId

        try {
            imageId = await uploadImage(data.image)
        } catch (e) {
            setError('root.serverError', { type: 'server' })
            return
        }

        try {
            await submitImageProposal({
                showId,
                image: imageId
            })
        } catch (e) {
            const res = await deleteImage(imageId)
            setError('root.serverError', { type: 'server' })
            return
        }
        
        setTimeout(closeModal, 2000)

    }

    return <>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>

            <p className="text-sm text-cream mb-3 italic">upload your photo below – <br></br>maximum file size of 4.5mb please :)</p>

            <div className="flex flex-col gap-2">
                <div className="relative flex flex-col gap-2">
                <div className=" bg-gray-3 px-3 rounded-sm py-3">
                <Controller
                    // https://claritydev.net/blog/react-hook-form-multipart-form-data-file-uploads
                    // https://stackoverflow.com/questions/5697605/limit-the-size-of-a-file-upload-html-input-element
                    control={control}
                    name={"image"}
                    rules={{ 
                        required: "No image selected.",
                        // https://github.com/orgs/react-hook-form/discussions/7812#discussioncomment-2168853
                        validate: (value) => {
                            if (value.size > (4.5 * 1048576)) { // 4.5MB
                                return "File size cannot exceed 4.5mb.";
                            }
                            return true;
                        }
                    
                    }}
                    render={({ field: { value, onChange, ...field } }) => {
                        return (
                          <input
                                {...field}
                                value={value?.fileName}
                                onChange={(event) => {
                                onChange(event.target.files[0]);
                                }}
                                type="file"
                                className="text-sm text-cream"
                                id="image"
                                // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
                                accept=".png, .jpg, .jpeg"
                          />
                        );
                    }}
                />
                </div>
                {errors.image && <span className="text-xs text-red-500 italic">{errors.image.message}</span>}
                </div>
                <span className={`text-xs mt-3 italic flex items-center gap-1 py-1 transition-colors duration-200 ease ${termsAccepted ? 'text-stone-100' : 'text-stone-300'}`}>
                    <input 
                        type='checkbox'
                        {...register("consent", {
                            required: true,
                            onChange: (e) => setTermsAccepted(e.target.checked)
                        })}
                    />
                    &nbsp; I agree to the <a href='/Pinegrove_Web_Release.pdf' className="text-trail-yellow underline" target="_blank">Terms of Service</a>
                </span>
            </div>

            <input 
                type="submit" 
                className={`green-button transition-opacity duration-200 ease ${termsAccepted ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-50'}`} 
                value="submit image"
                disabled={!termsAccepted}
            />
            {(isSubmitting && !isSubmitted) && 
                <div className="text-sm italic text-cream">sending...</div>}
            {(errors.root) && (errors.root.serverError) &&
                <div className="text-sm text-red-500" >error uploading image :( please try again momentarily.</div>}
            {(errors.root) && (errors.root.recaptchaError) &&
                <div className="text-sm text-red-500">error verifying reCAPTCHA :( please try again momentarily.</div>}
            {isSubmitSuccessful && 
                <div className="text-sm text-cream">
                thank you, we&apos;ve received your image submission!
                </div>}
        </form>
    </>
}