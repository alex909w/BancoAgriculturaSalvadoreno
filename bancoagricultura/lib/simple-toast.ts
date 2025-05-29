// Archivo de reemplazo simple para toast sin hooks complejos
export const toast = {
  success: (message: string) => {
    if (typeof window !== "undefined") {
      console.log("Success:", message)
    }
  },
  error: (message: string) => {
    if (typeof window !== "undefined") {
      console.error("Error:", message)
    }
  },
  info: (message: string) => {
    if (typeof window !== "undefined") {
      console.info("Info:", message)
    }
  },
  warning: (message: string) => {
    if (typeof window !== "undefined") {
      console.warn("Warning:", message)
    }
  },
}
