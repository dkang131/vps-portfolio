'use client'

import { useState } from 'react'

export default function FaceVerification() {
    const [image1, setImage1] = useState<string | null>(null)
    const [image2, setImage2] = useState<string | null>(null)
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const handleVerify = async () => {
        if (!image1 || !image2) return
        
        setLoading(true)

        const formData = new FormData()
        formData.append('image1', image1)
        formData.append('image2', image2)

        const response = await fetch('http://localhost:3839/api/verify', {
            method: 'POST',
            body: formData,
        })
        const data = await response.json()
        setResult(data)
        setLoading(false)
    }

    return (
        <div className="w-full max-w-3xl mx-auto p- rounded-2xl border border-zinc-800 bg-zinc-900 text-white">
            <h2 className="text-3xl font-bold mb-6">AI Face Verification Demo</h2>
            <p className="text-zinc-400 mb-8">Upload two images of the same person to verify if they are the same.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage1(e.target.files?.[0] || null)}
                    className="border border-zinc-700 p-3 rounder-xl"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage2(e.target.files?.[0] || null)}
                    className="border border-zinc-700 p-3 rounded-xl"
                />
            </div>
            <button 
                onClick={handleVerify}
                disabled={loading}
                className="mt-6 px-6 py-3 rounded-xl bg-white text-black font-semibold">
                {loading ? 'Verifying...' : 'Verify Faces'}
            </button>
            {result && (
                <div className="mt-8 p-6 rounded-xl bg-zinc-800">
                    <p className="text-xl font-semibold">
                        Match Result:
                    </p>

                    <p className="mt-2">
                        {result.matched ? '✅ Same Person' : '❌ Different Person'}
                    </p>

                    <p className="mt-2 text-zinc-400">
                        Similarity Score: {result.similarity?.toFixed(4)}
                    </p>
                </div>
            )}
        </div>
    )
}

