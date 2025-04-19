```tsx
export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 mt-25">
      <div>Please wait...</div>
      <div className="w-[300px] h-1 bg-gray-200 rounded overflow-hidden">
        <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
```