import TabBar from "@/componets/TabBar";

/**
 * ui.pen の frame (402 x 874 / fill #FFF9F5) にあたる共通の枠。
 * html / body は root layout が持っているのでここでは div でラップする。
 */
export default function ScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-canvas font-sans">
      {children}
      <TabBar />
    </div>
  );
}
