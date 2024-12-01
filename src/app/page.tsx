import MovieSearch from "@/components/MovieSearch";

export default async function Home() {
  return (
    <div className='flex flex-col min-h-screen items-center justify-center'>
      <h1 className="text-4xl font-bold mb-4">CineSelect</h1>
      <div className="w-full max-w-md">
        <MovieSearch />
      </div>
    </div>
  );
}
