import Link from "next/link";
import { ArrowRight } from "@/components/Icons";
import { NotFoundDoor } from "@/components/SceneSlots";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-16 lg:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <span className="eyebrow justify-center lg:justify-start">404</span>
          <h1 className="h-display mt-4 text-4xl text-navy-950 sm:text-5xl">This door leads nowhere</h1>
          <p className="mx-auto mt-4 max-w-md text-ink-500 lg:mx-0">
            The page you are looking for has moved or never existed. Let us show you the way back.
          </p>
          <div className="mt-8 flex justify-center gap-3 lg:justify-start">
            <Link href="/" className="btn-primary">
              Back home <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/products/doors" className="btn-outline">
              View products
            </Link>
          </div>
        </div>
        <NotFoundDoor />
      </div>
    </section>
  );
}
