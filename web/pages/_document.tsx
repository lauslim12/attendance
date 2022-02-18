import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

/**
 * AppDocument is used to set up initial color mode and to load Google Fonts.
 */
class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  /**
   * Method to render the main document part of the app.
   * Meta tags in order:
   * - Google Fonts
   * - Favicon
   * - Normal Meta Tags
   * - OpenGraph Tags
   *
   * @returns Next.js document.
   */
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
            rel="stylesheet"
          />

          <link rel="shortcut icon" href="favicon.png" type="image/png" />

          <meta
            name="description"
            content="The front-end implementation of Attendance, a proof of concept to show the security of a REST API that conforms to JSON:API and OWASP specifications."
          />

          <meta property="og:title" content="Fumi-no" />
          <meta
            property="og:description"
            content="The front-end implementation of Attendance, a proof of concept to show the security of a REST API that conforms to JSON:API and OWASP specifications."
          />
          <meta property="og:url" content="https://www.fumi-no.com" />
          <meta property="og:image" content="https://www.fumi-no.com/seo.jpg" />
          <meta property="og:image:alt" content="Icon for the website" />
          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:site_name" content="Fumi-no" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
