/**
 * Composable for generating BreadcrumbList Schema.org structured data
 * SEO Benefit: Shows navigation path in Google search results
 */

export interface BreadcrumbItem {
    name: string;
    url: string;
}

export const useBreadcrumbSchema = (items: BreadcrumbItem[]) => {
    const breadcrumbSchema = computed(() => {
        if (!items || items.length === 0) return null;

        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: `https://emwear.bg${item.url}`,
            })),
        };
    });

    // Inject breadcrumb schema into head
    watchEffect(() => {
        if (!breadcrumbSchema.value) return;

        useHead({
            script: [
                {
                    type: 'application/ld+json',
                    innerHTML: JSON.stringify(breadcrumbSchema.value),
                },
            ],
        });
    });

    return {
        breadcrumbSchema,
    };
};
