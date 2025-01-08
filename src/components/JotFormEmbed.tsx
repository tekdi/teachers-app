
interface JotFormEmbedProps {
    formId: string;
    queryParams: Record<string, string | number | boolean>; // Dynamic query parameters
}

const JotFormEmbed: React.FC<JotFormEmbedProps> = ({ formId, queryParams }) => {
    const jotformAPIKey = "your_api_key"; // Replace with your JotForm API key
    const queryString = new URLSearchParams(
        Object.entries(queryParams).reduce((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
        }, {} as Record<string, string>)
    ).toString();

    return (
        <>
            <iframe
                id="jotform-embed"
                title="Query Form"
                src={`https://form.jotform.com/${formId}?${queryString}`}
                style={{ minWidth: "100%", maxWidth: "100%", height: "100vh", border: "none" }}
            ></iframe>
            <script src='https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js'></script>
        </>
    );
};

export default JotFormEmbed;
