import JotFormEmbed from '@/components/JotFormEmbed';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const PageNotFound = () => {
    const { t } = useTranslation();
    const queryParams = {
        username: "JohnDoe",
        age: 30,
        isMember: true,
    };

    return (
        <>
            <Typography
                mt={4}
                variant="h2"
                fontSize="20px"
                lineHeight="30px"
                fontWeight="600"
                color="black"
            >
                {t('COMMON.PAGE_NOT_FOUND')}
            </Typography>
            <JotFormEmbed formId="250065095006449" queryParams={queryParams} />

        </>
    );
};

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
            // Will be passed to the page component as props
        },
    };
}

export default PageNotFound;
