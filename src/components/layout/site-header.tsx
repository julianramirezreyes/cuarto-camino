import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
      <Link href="/" className="font-serif text-lg tracking-wide">
        Cuarto Camino
      </Link>
    </header>
  );
}
