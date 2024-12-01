import MovieSearch from "@/components/MovieSearch";

export default async function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <MovieSearch />
    </div>
  );
}
