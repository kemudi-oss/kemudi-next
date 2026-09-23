'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h1>Something went wrong</h1>
        <pre>{error?.message}</pre>
        <pre>{error?.stack}</pre>
        <pre>Digest: {error?.digest}</pre>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
