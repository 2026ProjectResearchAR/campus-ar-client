export default function ScanPage() {
  return (
    <div className="relative w-full flex-1 h-full ">
      {/* Reactの変換を受けないよう iframe で純粋なHTMLを読み込む */}
      <iframe
        src="/ArScanner.html"
        className="w-full h-full border-0 absolute inset-0"
        allow="camera;"
      />
    </div>
  );
}