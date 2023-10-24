import imageFragment from './image';
import seoFragmentProduct from './seoProduct';

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    name
    description
    facetValues {
      name
      code
    }
    optionGroups {
      name
      code
      options {
        id
        name
        code
      }
    }
    variants {
      id
      name
      price
      currencyCode
      options {
        name
        code
      }
    }

    featuredAsset {
      ...image
    }
    assets {
      ...image
    }
    ...seoProduct
    updatedAt
  }
  ${imageFragment}
  ${seoFragmentProduct}
`;

export default productFragment;
