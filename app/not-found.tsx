import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="global flex h-screen w-screen justify-center items-center flex-col">
      <h1 className="text 5xl font-bold mb-4">Page not found</h1>
      <div style={{ width: '350px', height: '300px' }}>
        <Image
          src="/notfound.jpg"
          alt=""
          width={350}
          height={300}
          priority 
          style={{  height: '300px' }}
        />
      </div>
      <div className="mt-8">
        <Link href="/" className="hover:text-gray-600">
          Return Home
        </Link>
      </div>
    </div>
  );
}