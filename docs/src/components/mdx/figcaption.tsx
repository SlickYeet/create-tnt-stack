interface FigcaptionProps {
  children: React.ReactNode
}

export function Figcaption({ children }: FigcaptionProps) {
  return (
    <figcaption className="bg-muted/80 border-input/80 -mb-6 w-auto rounded-t-lg border px-5 py-2 md:min-w-sm">
      {children}
    </figcaption>
  )
}
