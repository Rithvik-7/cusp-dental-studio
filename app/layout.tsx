import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cusp Dental Studio — Your smile. The next chapter.",
  description: "A fictional premium dental studio demo for preventive, restorative and cosmetic care.",
  openGraph: {
    title: "Cusp Dental Studio | Modern Dentistry in Bengaluru",
    description: "A fictional premium dental studio demo for preventive, restorative and cosmetic care.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cusp Dental Studio | Modern Dentistry in Bengaluru",
    description: "A fictional premium dental studio demo for preventive, restorative and cosmetic care.",
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{document.documentElement.dataset.theme=localStorage.getItem('cusp-theme')||'light'}catch(e){}`}}/></head><body>{children}</body></html>;
}
