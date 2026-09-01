import TabBar from "@/componets/TabBar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // htmlやbodyは使ってはならず,divでラップする
        <div>
            <div>
                {children}
                <TabBar />
            </div>
        </div>
    )
} 