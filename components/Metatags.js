import Head from "next/head";

export default function MetaTags({title, description, image}) {
    return (
        <Head>
            <title>{title}</title>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@fireship_dev" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* https://ogp.me/ */}
            {/* https://ahrefs.com/blog/open-graph-meta-tags/ */}
            <meta property="og:title" content={title} />
            <meta property="og:descripiton" content={description} />
            <meta property="og:image" content={image} />

        </Head>
    );
}