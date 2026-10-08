import TabBar from "@/componets/TabBar";

/**
 * ui.pen の frame (402 x 874) にあたる共通の枠。
 * html / body と上部の NavBar は root layout が持っているので、
 * ここでは残りの高さ (flex-1) を埋める div でラップする。
 */
export default function ScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto flex w-full flex-1 max-w-[430px] flex-col bg-canvas font-sans">
      {children}
      <TabBar />
    </div>
  );
}
