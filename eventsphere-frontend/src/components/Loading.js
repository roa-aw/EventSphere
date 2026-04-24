export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      
      <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />

      <p className="mt-4 text-gray-500">{message}</p>
    </div>
  )
}