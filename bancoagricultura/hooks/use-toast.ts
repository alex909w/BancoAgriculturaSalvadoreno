"use client"

import { useState, useCallback } from "react"

export interface ToastProps {
  id?: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

interface ToastState {
  toasts: ToastProps[]
}

let toastCounter = 0
const listeners: Array<(state: ToastState) => void> = []
let memoryState: ToastState = { toasts: [] }

function emitChange() {
  listeners.forEach((listener) => listener(memoryState))
}

export function toast(props: Omit<ToastProps, "id">) {
  const id = (++toastCounter).toString()
  const toastWithId = { ...props, id }

  memoryState = {
    ...memoryState,
    toasts: [...memoryState.toasts, toastWithId],
  }

  emitChange()

  // Auto remove after duration
  const duration = props.duration || 5000
  setTimeout(() => {
    dismiss(id)
  }, duration)

  return {
    id,
    dismiss: () => dismiss(id),
    update: (newProps: Partial<ToastProps>) => {
      memoryState = {
        ...memoryState,
        toasts: memoryState.toasts.map((t) => (t.id === id ? { ...t, ...newProps } : t)),
      }
      emitChange()
    },
  }
}

function dismiss(toastId?: string) {
  memoryState = {
    ...memoryState,
    toasts: toastId ? memoryState.toasts.filter((t) => t.id !== toastId) : [],
  }
  emitChange()
}

export function useToast() {
  const [state, setState] = useState<ToastState>(memoryState)

  const subscribe = useCallback((listener: (state: ToastState) => void) => {
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  // Subscribe to changes
  useState(() => {
    const unsubscribe = subscribe(setState)
    return unsubscribe
  })

  return {
    ...state,
    toast,
    dismiss,
  }
}
