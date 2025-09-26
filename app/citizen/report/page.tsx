'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Camera, MapPin, Upload, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/AuthProvider'
import { uploadReportImages } from '@/lib/storage'
import { fetchNearbyFacilities, getFacilityById, FacilityRecord } from '@/lib/facilities'

interface FormData {
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  address: string
  latitude?: number
  longitude?: number
  facilityId?: string
}

export default function ReportIssuePage() {
  const router = useRouter()
  const params = useSearchParams()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    address: '',
    latitude: undefined,
    longitude: undefined,
    facilityId: undefined
  })
  
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [nearbyFacilities, setNearbyFacilities] = useState<FacilityRecord[]>([])
  const [prefillFacility, setPrefillFacility] = useState<FacilityRecord | null>(null)
  const [savingDraft, setSavingDraft] = useState(false)
  const [addressQuery, setAddressQuery] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([])
  const addressFetchTimeout = useRef<any>(null)
  const draftSaveTimeout = useRef<any>(null)
  const [duplicateHints, setDuplicateHints] = useState<Array<{ id: string; title: string; status: string; address: string }>>([])
  const duplicateFetchTimeout = useRef<any>(null)

  useEffect(() => {
    const fid = params.get('facilityId')
    if (fid) {
      getFacilityById(fid).then(f => {
        if (f) {
          setPrefillFacility(f)
          setFormData(prev => ({
            ...prev,
            facilityId: f.id,
            address: f.address || prev.address,
            latitude: f.latitude,
            longitude: f.longitude
          }))
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load draft from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('citizen-report-draft')
      if (raw) {
        const draft = JSON.parse(raw)
        setFormData((prev) => ({
          ...prev,
          ...draft.formData,
        }))
        if (Array.isArray(draft.selectedImages)) {
          // Cannot restore File objects; ignore images in draft
        }
      }
    } catch {}
  }, [])

  // Autosave draft (debounced)
  useEffect(() => {
    if (draftSaveTimeout.current) clearTimeout(draftSaveTimeout.current)
    draftSaveTimeout.current = setTimeout(() => {
      try {
        setSavingDraft(true)
        localStorage.setItem(
          'citizen-report-draft',
          JSON.stringify({ formData })
        )
      } catch {}
      setSavingDraft(false)
    }, 500)
    return () => clearTimeout(draftSaveTimeout.current)
  }, [formData])

  const clearDraft = () => {
    localStorage.removeItem('citizen-report-draft')
    toast.success('Draft cleared')
  }

  const categories = [
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'environment', label: 'Environment' },
    { value: 'safety', label: 'Public Safety' },
    { value: 'transport', label: 'Transport' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'other', label: 'Other' },
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-100' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600 bg-red-100' },
  ]

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length > 0) {
      Promise.all(imageFiles.slice(0, 5).map(compressImage))
        .then((compressed) => {
          setSelectedImages(prev => [...prev, ...compressed].slice(0, 5)) // Max 5 images
        })
        .catch(() => {
          setSelectedImages(prev => [...prev, ...imageFiles].slice(0, 5))
        })
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const moveImage = (from: number, to: number) => {
    setSelectedImages(prev => {
      const next = [...prev]
      if (to < 0 || to >= next.length) return next
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser')
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude
        }))

        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          .then(response => response.json())
          .then(data => {
            if (data.locality && data.principalSubdivision) {
              setFormData(prev => ({
                ...prev,
                address: `${data.locality}, ${data.principalSubdivision}`
              }))
            }
          })
          .catch(() => {
            setFormData(prev => ({
              ...prev,
              address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
            }))
          })
          .finally(async () => {
            setIsGettingLocation(false)
            try {
              const facilities = await fetchNearbyFacilities({ latitude, longitude, radiusMeters: 3000, types: ['hospital','police','water','electricity','municipal','school','transport'] })
              setNearbyFacilities(facilities)
            } catch {}
          })
      },
      (error) => {
        console.error('Error getting location:', error)
        toast.error('Failed to get current location')
        setIsGettingLocation(false)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.address.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!user) {
      toast.error('You must be logged in to report an issue')
      return
    }

    setIsSubmitting(true)

    try {
      const locationData = formData.latitude && formData.longitude ? {
        type: 'Point',
        coordinates: [formData.longitude, formData.latitude] as [number, number]
      } : undefined

      const reportData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        status: 'pending',
        address: formData.address.trim(),
        location: locationData,
        user_id: user.id,
        media_urls: [],
        // facility_id: formData.facilityId // Consider adding this column in DB to persist linkage
      }

      const { createCitizenReport } = await import('@/lib/citizen-queries')

      let uploadedUrls: string[] = []
      if (selectedImages.length > 0) {
        uploadedUrls = await uploadReportImages(selectedImages, user.id)
      }

      await createCitizenReport({ ...reportData, media_urls: uploadedUrls })

      toast.success('Issue reported successfully!')
      localStorage.removeItem('citizen-report-draft')
      router.push('/citizen')
    } catch (error) {
      console.error('Error submitting report:', error)
      toast.error('Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Address autocomplete via Nominatim (debounced)
  useEffect(() => {
    if (!addressQuery || addressQuery.length < 3) {
      setAddressSuggestions([])
      return
    }
    if (addressFetchTimeout.current) clearTimeout(addressFetchTimeout.current)
    addressFetchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(addressQuery)}`, {
          headers: { 'Accept-Language': 'en' }
        })
        const data = await res.json()
        setAddressSuggestions((data || []).map((d: any) => ({ display_name: d.display_name, lat: d.lat, lon: d.lon })))
      } catch {
        setAddressSuggestions([])
      }
    }, 300)
    return () => clearTimeout(addressFetchTimeout.current)
  }, [addressQuery])

  const pickSuggestion = (s: { display_name: string; lat: string; lon: string }) => {
    setFormData(prev => ({
      ...prev,
      address: s.display_name,
      latitude: Number(s.lat),
      longitude: Number(s.lon)
    }))
    setAddressSuggestions([])
  }

  async function compressImage(file: File): Promise<File> {
    try {
      const img = document.createElement('img')
      const reader = new FileReader()
      const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
        reader.onload = () => { img.src = reader.result as string; img.onload = () => resolve(img); img.onerror = reject }
        reader.onerror = reject
      })
      reader.readAsDataURL(file)
      const image = await loadPromise
      const maxDim = 1600
      let { width, height } = image
      const scale = Math.min(1, maxDim / Math.max(width, height))
      width = Math.round(width * scale)
      height = Math.round(height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(image, 0, 0, width, height)
      const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', 0.8)!)
      return new File([blob], file.name.replace(/\.(png|jpeg|jpg|webp)$/i, '.jpg'), { type: 'image/jpeg' })
    } catch {
      return file
    }
  }

  // Duplicate detection hint (debounced by title)
  useEffect(() => {
    const q = formData.title.trim()
    if (!q || q.length < 3) { setDuplicateHints([]); return }
    if (duplicateFetchTimeout.current) clearTimeout(duplicateFetchTimeout.current)
    duplicateFetchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/reports/similar?q=${encodeURIComponent(q)}&lat=${formData.latitude ?? ''}&lng=${formData.longitude ?? ''}&limit=5`)
        const data = await res.json()
        setDuplicateHints(Array.isArray(data.items) ? data.items : [])
      } catch {
        setDuplicateHints([])
      }
    }, 300)
    return () => clearTimeout(duplicateFetchTimeout.current)
  }, [formData.title, formData.latitude, formData.longitude])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              title="Go back"
              aria-label="Go back"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                NagarSetu - Report Issue
              </h1>
              <p className="text-sm text-gray-600 mt-1">Help improve your community</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Prefill banner */}
        {prefillFacility && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="text-sm text-blue-900">
              Reporting for: <span className="font-semibold">{prefillFacility.name}</span>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Issue Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Briefly describe the issue"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-lg"
            required
          />
          {duplicateHints.length > 0 && (
            <div className="mt-3 border border-amber-200 bg-amber-50 rounded-xl p-3">
              <div className="text-sm font-semibold text-amber-800 mb-2">Possible duplicates nearby</div>
              <ul className="space-y-2">
                {duplicateHints.map((d) => (
                  <li key={d.id} className="text-sm text-amber-900 flex items-center justify-between">
                    <div className="pr-2 truncate">
                      <div className="font-medium truncate">{d.title}</div>
                      <div className="text-xs text-amber-700 truncate">{d.address}</div>
                    </div>
                    <a href={`/citizen/issues/${d.id}`} className="text-xs text-blue-700 hover:underline flex-shrink-0">View</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Provide detailed information about the issue"
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
            required
          />
        </div>

        {/* Category */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Category *
          </label>
          <select
            id="category"
            aria-label="Category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Priority Level
          </label>
          <div className="grid grid-cols-2 gap-3">
            {priorities.map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => handleInputChange('priority', priority.value)}
                className={`p-4 rounded-xl border-2 text-center font-medium transition-all duration-200 ${
                  formData.priority === priority.value
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${priority.color} mb-2`}>
                  {priority.label}
                </div>
                <div className="text-sm text-gray-600">
                  {priority.value === 'urgent' && 'Immediate attention needed'}
                  {priority.value === 'high' && 'Important issue'}
                  {priority.value === 'medium' && 'Moderate priority'}
                  {priority.value === 'low' && 'Low priority'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Photos (Optional)
          </label>
          <div className="space-y-4">
            {/* Image Preview */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl shadow-sm"
                    />
                    <button
                      type="button"
                      title="Remove image"
                      aria-label="Remove image"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Image Button */}
            {selectedImages.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group"
              >
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                    <Camera className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Add Photo</p>
                  <p className="text-xs text-gray-500">Tap to select from gallery</p>
                  <p className="text-xs text-gray-400 mt-1">Up to 5 photos</p>
                </div>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              aria-label="Add photo"
              title="Add photo"
              placeholder="Select images to upload"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Location *
          </label>
          <div className="space-y-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={formData.address}
                onChange={(e) => { handleInputChange('address', e.target.value); setAddressQuery(e.target.value) }}
                placeholder="Enter the location of the issue"
                className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                required
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="px-4 py-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-indigo-200 disabled:opacity-50 transition-all duration-200 border border-blue-200"
              >
                {isGettingLocation ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : (
                  <MapPin className="h-5 w-5" />
                )}
              </button>
            </div>
            {formData.latitude && formData.longitude && (
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="p-1.5 bg-green-100 rounded-lg mr-3">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Location detected</p>
                  <p className="text-xs text-green-600">
                    {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            )}

            {/* Address suggestions */}
            {addressSuggestions.length > 0 && (
              <div className="border border-gray-200 rounded-xl bg-white shadow-sm divide-y">
                {addressSuggestions.map((s, idx) => (
                  <button key={idx} type="button" onClick={() => pickSuggestion(s)} className="w-full text-left px-3 py-2 hover:bg-gray-50">
                    <div className="text-sm text-gray-900">{s.display_name}</div>
                    <div className="text-xs text-gray-500">{Number(s.lat).toFixed(5)}, {Number(s.lon).toFixed(5)}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Nearby facility suggestions */}
            {nearbyFacilities.length > 0 && (
              <div className="pt-2">
                <div className="text-sm font-semibold text-gray-800 mb-2">Nearby facilities</div>
                <div className="flex gap-2 overflow-x-auto">
                  {nearbyFacilities.map(f => (
                    <button key={f.id} type="button" onClick={() => handleInputChange('facilityId', f.id)} className={`px-3 py-2 rounded-xl border text-xs whitespace-nowrap ${formData.facilityId === f.id ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-700'}`}>
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-xl mr-4 flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-3 text-lg">Tips for better reports:</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                  Be specific about the location
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                  Include clear photos if possible
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                  Provide detailed description
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                  Choose appropriate priority level
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Draft status & actions */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">{savingDraft ? 'Saving draft…' : 'Draft autosaved'}</div>
          <button type="button" onClick={clearDraft} className="text-xs text-red-600 hover:text-red-700">Clear draft</button>
        </div>
      </form>
    </div>
  )
}
