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
          <link rel="shortcut icon" href="favicon.png" type="image/png" />

          <meta
            name="description"
            content="The front-end implementation of Attendance, a proof of concept to show the security of a REST API that conforms to JSON:API and OWASP specifications."
          />

          <meta property="og:title" content="Attendance" />
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
          <meta property="og:site_name" content="Attendance" />
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
