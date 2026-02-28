'use client'

import { useEffect, useRef, useState } from 'react'
import { Eraser } from 'lucide-react'

import { Button } from '@/components/ui/button'

type SignatureInputProps = {
  canvasRef?: React.MutableRefObject<HTMLCanvasElement | null>
  onSignatureChange: (signature: string | null) => void
}

type Point = {
  x: number
  y: number
}

const STROKE_COLOR = '#000000'
const STROKE_WIDTH = 2

export default function SignatureInput({
  canvasRef: externalCanvasRef,
  onSignatureChange,
}: SignatureInputProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null)
  const canvasRef = externalCanvasRef ?? internalCanvasRef
  const isDrawingRef = useRef(false)
  const hasStrokeRef = useRef(false)
  const [lastPoint, setLastPoint] = useState<Point | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.lineWidth = STROKE_WIDTH
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = STROKE_COLOR

    const preventTouchScroll = (e: TouchEvent) => {
      e.preventDefault()
    }

    canvas.addEventListener('touchstart', preventTouchScroll, { passive: false })
    canvas.addEventListener('touchmove', preventTouchScroll, { passive: false })
    canvas.addEventListener('touchend', preventTouchScroll, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', preventTouchScroll)
      canvas.removeEventListener('touchmove', preventTouchScroll)
      canvas.removeEventListener('touchend', preventTouchScroll)
    }
  }, [canvasRef])

  const getPoint = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()

    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY
    if (clientX === undefined || clientY === undefined) return null

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault()
    const point = getPoint(e)
    if (!point) return
    isDrawingRef.current = true
    hasStrokeRef.current = false
    setLastPoint(point)
  }

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault()
    if (!isDrawingRef.current) return

    const canvas = canvasRef.current
    const point = getPoint(e)
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !point) return

    const from = lastPoint ?? point
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    hasStrokeRef.current = true

    setLastPoint(point)
  }

  const stopDrawing = () => {
    if (!isDrawingRef.current) return

    isDrawingRef.current = false
    setLastPoint(null)

    if (!hasStrokeRef.current) return
    hasStrokeRef.current = false

    const canvas = canvasRef.current
    if (!canvas) return
    onSignatureChange(canvas.toDataURL())
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    isDrawingRef.current = false
    hasStrokeRef.current = false
    setLastPoint(null)
    onSignatureChange(null)
  }

  const setCanvasRef = (element: HTMLCanvasElement | null) => {
    internalCanvasRef.current = element
    if (externalCanvasRef) {
      externalCanvasRef.current = element
    }
  }

  return (
    <div className="relative h-[200px] w-full max-w-[420px] overflow-hidden rounded-md border border-gray-300 bg-white">
      <canvas
        ref={setCanvasRef}
        width={420}
        height={200}
        className="h-full w-full cursor-crosshair touch-none bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="absolute bottom-1 left-1 z-10 rounded-full"
        onClick={clearSignature}
      >
        <Eraser className="h-4 w-4 text-muted-foreground hover:text-primary" />
      </Button>
    </div>
  )
}
