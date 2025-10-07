import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <FileQuestion className="mb-6 h-24 w-24 text-muted-foreground" />
      <h1 className="mb-2 text-4xl font-bold">Software Not Found</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        The software you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild size="lg">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}
