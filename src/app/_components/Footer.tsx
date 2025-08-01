import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-accent-foreground w-full py-5">
      <div className="mx-6 flex flex-col gap-2 text-sm text-gray-600">
        <a href="/about" className="">
          About
        </a>
        <a href="/privacy-policy" className="">
          Privacy Policy
        </a>
        <a href="/terms-of-service" className="">
          Terms of Service
        </a>
      </div>

      <div className="mt-5 flex justify-end">
        <Image
          src="/images/placeholderLogo.png"
          alt="App Logo"
          width={150}
          height={50}
          priority
          className="align-right mx-4"
        />
      </div>
    </footer>
  );
}
