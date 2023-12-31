import OpengraphImage from 'components/opengraph-image';
// import { getPage } from 'lib/vendure';

export const runtime = 'edge';

export default async function Image({ params }: { params: { page: string } }) {
  // const page = await getPage(params.page);
  const title = process.env.SITE_NAME || 'Vendure Store';
  // const title = page.seo?.title || page.title;

  return await OpengraphImage({ title });
}
