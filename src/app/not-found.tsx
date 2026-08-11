import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-primary/20">404</p>
      <h1 className="mt-4 text-3xl font-black">Page Not Found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        This page no longer exists. You can return home or contact us for service support.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/"><Button variant="accent">Home</Button></Link>
        <Link href="/contact"><Button variant="outline">Contact</Button></Link>
      </div>
    </div>
  );
}
