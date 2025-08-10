import { Header } from "@/src/components/organisms/Header";

type Props = {
    children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
    return (
        <div className="flex flex-col w-dvw justify-center items-center bg-muted/40">
            <Header />
            {children}
        </div>
    );
}