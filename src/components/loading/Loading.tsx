// components/Loading.tsx

export default function Loading() {
  return (
    <div className='flex justify-center items-center py-6'>
      <div className='animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary'></div>
    </div>
  );
}
