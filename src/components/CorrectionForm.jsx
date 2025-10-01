'use client'
import { useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import ReCAPTCHA from "react-google-recaptcha"
import { submitCorrection, verifyReCAPTCHA } from "@/actions/actions"
import { useRouter } from "next/navigation"

export default function CorrectionForm() {

    let recaptchaRef = useRef()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        control,
        reset,
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
            await submitCorrection(data)
        } catch (e) {
            setError('root.serverError', { type: 'server' })
            return
        }

        setTimeout(() => {
            reset()
        }, 2000)

        setTimeout(() => {
            router.push('/')
        }, 3000)
        
    }
    
    return <>
        <div className="wood-shadow drop-shadow-2xl wood-550 w-full max-w-[400px] min-w-[288px] rounded flex justify-center my-24 p-2 pt-[2px] max-h-[80vh]">
            <div className="z-[500] flex w-full items-center flex-col gap-1">
                <div className="flex p-1 px-2 text-xl font-pg w-full text-trail-yellow justify-between">
                    <h1 className="">Correction Form</h1>
                </div>


                <section className="relative flex w-full p-6 rounded-sm shadow-inner-show bg-gray-2 overflow-scroll hidden-scrollbar flex-grow flex-col">

                <p className="text-sm text-cream mb-3 italic mb-6">see an error or want your submitted data removed? please let us know here!</p>

                    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>

                        <div className="flex flex-col gap-2">
                            <input
                                placeholder="Email"
                                className="bg-gray-3 text-cream px-2 py-1 w-full text-sm rounded-sm"
                                type="email"
                                {...register("email", {
                                    required: true,
                                    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                })}
                            />
                            {errors.email && <span className="text-sm text-pg-red">Invalid Email.</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <textarea
                                placeholder="Details (please include show date & location, if applicable)"
                                className="bg-gray-3 text-cream px-2 py-1 min-h-32 w-full text-sm rounded-sm"
                                {...register("details", {
                                    required: true
                                })}
                            />
                            {errors.details && <span className="text-sm text-pg-red">Required field.</span>}
                        </div>

                        <input type="submit" className={`mt-4 mb-1 green-button transition-opacity duration-200 ease cursor-pointer opacity-100`}  value="submit correction" />
                        {(isSubmitting && !isSubmitted) && 
                            <div className="text-sm text-cream">sending...</div>}
                        {(errors.root) && (errors.root.serverError) &&
                            <div className="text-sm text-pg-red">error submitting, please try again momentarily</div>}
                        {(errors.root) && (errors.root.recaptchaError) &&
                            <div className="text-sm text-pg-red">error verifying reCAPTCHA, please try again momentarily.</div>}
                        {isSubmitSuccessful && 
                            <div className="text-sm text-cream">
                            thank you, we&apos;ve received your message!
                            </div>}
                    </form>
                </section>
            </div>
        </div>
        <div id="recaptcha-container">
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
    </>
}