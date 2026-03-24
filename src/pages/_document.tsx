import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="uk">
      <Head>
        <meta name="theme-color" content="#090910" />
        <meta name="color-scheme" content="dark" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💰</text></svg>"
        />
        {/* Telegram WebApp SDK — must load before React */}
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
