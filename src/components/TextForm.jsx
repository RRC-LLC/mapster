'use client'
import {  useState } from "react"
import { useForm } from "react-hook-form"
import { submitTextProposal, verifyReCAPTCHA } from "@/actions/actions"

export default function TextForm({ showId, closeModal, recaptchaRef }) {
    const [termsAccepted, setTermsAccepted] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        control,
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

        try {
            await submitTextProposal({
                showId,
                content: data.content
            })
        } catch (e) {
            setError('root.serverError', { type: 'server' })
            return
        }

        setTimeout(closeModal, 2000)
        
    }
    
    return <>
        <form className="flex flex-col gap-3 " onSubmit={handleSubmit(onSubmit)}>

            <p className="text-sm text-cream mb-3 italic">share a written note – <br></br>maximum 500 characters.</p>
            <div className="flex flex-col gap-2 media-upload">
                <textarea
                    placeholder="What was your favorite memory from the show?"
                    className="bg-gray-3 px-2 py-1 min-h-48 w-full text-sm rounded-sm"
                    type="textarea"
                    {...register("content", {
                        required: true,
                        maxLength: 500
                    })}
                />
                {errors.content && errors.content.type === "required" && <span className="text-sm text-red-500">Field required.</span>}
                {errors.content && errors.content.type === "maxLength" && <span className="text-sm text-red-500">Max length exceeded.</span> }
                <span className={`text-xs mt-3  italic flex items-center gap-1 py-1 transition-colors duration-200 ease ${termsAccepted ? 'text-stone-100' : 'text-stone-300'}`}>
                    <input 
                        type='checkbox'
                        {...register("consent", {
                            required: true,
                            onChange: (e) => setTermsAccepted(e.target.checked)
                        })}
                    />
                    &nbsp; I agree to the <a href='/Pinegrove_Web_Release.pdf' className="text-trail-yellow" target="_blank">Terms of Service</a>
                </span>
                {errors.consent && <span className="text-sm text-red-500">Field required.</span>}
             </div>

            <input 
                type="submit" 
                className={`green-button transition-opacity duration-200 ease ${termsAccepted ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-50'}`} 
                value="submit note"
                disabled={!termsAccepted}
            />
             {(isSubmitting && !isSubmitted) && 
                <div className="text-sm italic text-cream">sending...</div>}
            {(errors.root) && (errors.root.serverError) &&
                <div className="text-sm text-red-500" >error uploading note :( please try again momentarily.</div>}
            {(errors.root) && (errors.root.recaptchaError) &&
                <div className="text-sm text-red-500">error verifying reCAPTCHA :( please try again momentarily.</div>}
            {isSubmitSuccessful && 
                <div className="text-sm text-cream">
                thank you, we&apos;ve received your note submission!
                </div>}
        </form>
    </>
}