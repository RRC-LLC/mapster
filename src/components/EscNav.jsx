'use client'
import { useEffect } from "react"
import { useRouter } from 'next/navigation'

export default function EscNav() {

    const router = useRouter()

    const routeOnEsc = (e) => {
        if (e.keyCode == 27) {
            router.push("/")
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', routeOnEsc)
    })

    return <>
    
    </>
}