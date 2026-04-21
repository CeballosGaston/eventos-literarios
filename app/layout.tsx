import ReactQueryProvider from "@/shared/providers/ReactQueryProvider"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import './globals.css';
import { Toaster } from "sonner";
import { Navbar } from "@/shared/components/layout/Navbar";



const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
      
        
        <ReactQueryProvider>
         <Navbar /> 
          <main>
            {children}
          </main>
        </ReactQueryProvider>
        <Toaster richColors position="top-right" style={{ zIndex: 9999 }} />
     
      </body>
    </html>
  )
}