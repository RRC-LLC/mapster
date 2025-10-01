import CorrectionForm from "@/components/CorrectionForm"

export const metadata = {
  title: {
    default: "Pinegrove | Corrections",
  },
  description: "Submit corrections for Pinegrove show data.",
  openGraph: {
    title: "Pinegrove | Corrections",
    description: "Submit corrections for Pinegrove show data.",
  },
  twitter: {
    title: "Pinegrove | Corrections",
    description: "Submit corrections for Pinegrove show data.",
  },
}

export default function CorrectionsPage() {
  return (
    <main className="w-screen h-screen bg-v2-wallpaper bg-medium sm:bg-small flex items-center justify-center">
      <CorrectionForm />
    </main>
  )
} 