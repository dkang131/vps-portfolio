import { useState } from 'react'
import './FaceVerification.css'

interface VerifyResult {
  success: boolean
  similarity: number
  matched: boolean
}

export default function FaceVerification() {
  const [image1, setImage1] = useState<File | null>(null)
  const [image2, setImage2] = useState<File | null>(null)
  const [preview1, setPreview1] = useState<string | null>(null)
  const [preview2, setPreview2] = useState<string | null>(null)
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, num: 1 | 2) => {
    const file = e.target.files?.[0] || null
    if (num === 1) {
      setImage1(file)
      setPreview1(file ? URL.createObjectURL(file) : null)
    } else {
      setImage2(file)
      setPreview2(file ? URL.createObjectURL(file) : null)
    }
    setError(null)
    setResult(null)
  }

  const handleVerify = async () => {
    if (!image1 || !image2) return

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('image1', image1)
    formData.append('image2', image2)

    try {
      const response = await fetch('http://localhost:3839/api/verify', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify faces')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="face-verify" className="face-verify-section section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Demo</span>
          <h2>AI Face Verification Demo</h2>
        </div>

        <div className="face-verify-grid">
          <div className="face-verify-card">
            <h3>Image 1</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImage(e, 1)}
              className="face-verify-input"
            />
            {preview1 ? (
              <img src={preview1} alt="Preview 1" className="face-verify-preview" />
            ) : (
              <div className="face-verify-preview-placeholder">No image selected</div>
            )}
          </div>

          <div className="face-verify-card">
            <h3>Image 2</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImage(e, 2)}
              className="face-verify-input"
            />
            {preview2 ? (
              <img src={preview2} alt="Preview 2" className="face-verify-preview" />
            ) : (
              <div className="face-verify-preview-placeholder">No image selected</div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={handleVerify}
            disabled={loading || !image1 || !image2}
            className="face-verify-btn"
          >
            {loading ? 'Verifying...' : 'Verify Faces'}
          </button>
        </div>

        {error && (
          <div className="face-verify-error">{error}</div>
        )}

        {result && (
          <div className="face-verify-result">
            <h3>Match Result</h3>
            <p className={`face-verify-match ${result.matched ? 'same' : 'different'}`}>
              {result.matched ? '✅ Same Person' : '❌ Different Person'}
            </p>
            <p className="face-verify-score">
              Similarity Score: {result.similarity?.toFixed(4)}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
