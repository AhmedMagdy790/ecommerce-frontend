import { Helmet } from "react-helmet-async";

interface PageMetaProps {
    title: string;
    description?: string;
    image?: string;
}

export default function PageMeta({
    title,
    description,
    image,
}: PageMetaProps) {

    return (
        <Helmet>

            <title>
                {title}
            </title>


            {description && (
                <meta
                    name="description"
                    content={description}
                />
            )}


            {image && (
                <meta
                    property="og:image"
                    content={image}
                />
            )}

        </Helmet>
    );
}