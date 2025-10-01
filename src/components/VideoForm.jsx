'use client'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { submitVideoProposal, verifyReCAPTCHA } from "@/actions/actions"

export default function VideoForm({ showId, closeModal, recaptchaRef }) {
    const [termsAccepted, setTermsAccepted] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
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
            // https://stackoverflow.com/questions/13476060/validating-youtube-url-using-regex/41988283#41988283
            const exp = /[-_A-Za-z0-9]{10}[AEIMQUYcgkosw048]/
            const match = data.youtube_link.match(exp)
            await submitVideoProposal({
                showId,
                url: match[0]
            })
        } catch (e) {
            setError('root.serverError', { type: 'server' })
            return
        }

        setTimeout(closeModal, 2000)
        
    }
    
    return <>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        
            <p className="text-sm text-cream mb-3 italic">upload to youtube and paste the link – <br></br>unlisted videos work just fine.</p>

            
            <div className="flex flex-col gap-2 media-upload">
                <input
                    placeholder="youtube link"
                    className="bg-gray-3 px-2 py-2 w-full text-sm rounded-sm"
                    type="url"
                    {...register("youtube_link", {
                        // https://gist.github.com/Kaligula0/1ff5f4e2cf1f351daeca3450f71fdcb5
                        required: true,
                        pattern: /^(?:(?:https?:)?\/\/)?(?:(?:(?:www|m(?:usic)?)\.)?youtu(?:\.be|be\.com)\/(?:shorts\/|live\/|v\/|e(?:mbed)?\/|watch(?:\/|\?(?:\S+=\S+&)*v=)|oembed\?url=https?%3A\/\/(?:www|m(?:usic)?)\.youtube\.com\/watch\?(?:\S+=\S+&)*v%3D|attribution_link\?(?:\S+=\S+&)*u=(?:\/|%2F)watch(?:\?|%3F)v(?:=|%3D))?|www\.youtube-nocookie\.com\/embed\/)([\w-]{11})[\?&#]?\S*$/
                    })}
                />
                {errors.youtube_link && <span className="text-sm text-red-500">Add valid YouTube link.</span>}
                <span className={`text-xs mt-3 italic flex items-center gap-1 py-1 transition-colors duration-200 ease ${termsAccepted ? 'text-stone-100' : 'text-stone-300'}`}>
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
                value="submit video"
                disabled={!termsAccepted}
            />
            {(isSubmitting && !isSubmitted) && 
                <div className="text-sm italic text-cream">sending...</div>}
            {(errors.root) && (errors.root.serverError) &&
                <div className="text-sm text-red-500" >error uploading video :( please try again momentarily.</div>}
            {(errors.root) && (errors.root.recaptchaError) &&
                <div className="text-sm text-red-500">error verifying reCAPTCHA :( please try again momentarily.</div>}
            {isSubmitSuccessful && 
                <div className="text-sm text-cream">
                thank you, we&apos;ve received your video submission!
                </div>}
        </form>
    </>
}