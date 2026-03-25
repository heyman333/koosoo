import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Cormorant_Garamond, Cinzel, Special_Elite, Nunito, Nanum_Myeongjo } from "next/font/google";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-cinzel",
  display: "swap",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-special-elite",
  display: "swap",
});

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-nanum-myeongjo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://koosoo.vercel.app"
      : "http://localhost:3000"
  ),
  title: "한영수 ❤️ 구자민 - 2026.7.5",
  description: "저희 두 사람의 특별한 날에 초대합니다.",
  openGraph: {
    title: "한영수 ❤️ 구자민 - 2026.7.5",
    description: "저희 두 사람의 특별한 날에 초대합니다.",
    images: [
      {
        url: "/illust.png",
        width: 1080,
        height: 1080,
        alt: "한영수 ❤️ 구자민 웨딩",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/illust.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} ${cormorant.variable} ${cinzel.variable} ${specialElite.variable} ${nunito.variable} ${nanumMyeongjo.variable} antialiased`}
      >
        {children}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
