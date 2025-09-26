'use client'

import dynamic from 'next/dynamic'

interface SimpleMapProps {
  center: {
    lat: number
    lng: number
  }
  markers?: Array<{
    lat: number
    lng: number
    title?: string
    status?: string
  }>
  height?: string
  className?: string
}

export default function SimpleMap({ center, markers = [], height = '400px', className = '' }: SimpleMapProps) {
  const LeafletMap = dynamic(async () => {
    const L = await import('leaflet')
    const React = await import('react')
    const { useEffect, useRef } = React

    const Comp = ({ center, markers, height, className }: SimpleMapProps) => {
      const mapEl = useRef<HTMLDivElement>(null)
      const mapRef = useRef<any>(null)

      useEffect(() => {
        if (!mapEl.current || mapRef.current) return
        const map = L.map(mapEl.current).setView([center.lat, center.lng], 15)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map)

        markers?.forEach(m => {
          const marker = L.marker([m.lat, m.lng]).addTo(map)
          if (m.title || m.status) {
            marker.bindPopup(`<strong>${m.title ?? ''}</strong><div>${m.status ?? ''}</div>`)
          }
        })

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const p = [pos.coords.latitude, pos.coords.longitude] as [number, number]
            L.marker(p).addTo(map).bindPopup('You are here')
          })
        }

        mapRef.current = map
      }, [center, markers])

      return (
        <div className={`relative border rounded-lg overflow-hidden ${className}`} style={{ height }}>
          <div ref={mapEl} className="w-full h-full" />
        </div>
      )
    }

    return { default: Comp as any }
  }, { ssr: false })

  return (
    // @ts-ignore
    <LeafletMap center={center} markers={markers} height={height} className={className} />
  )
}
