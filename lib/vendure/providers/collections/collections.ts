import gql from 'graphql-tag';

import productFragment from '../../providers/fragments/product';
import seoFragmentProduct from '../../providers/fragments/seoProduct';


const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    name
    description
    productVariants {
      items {
        product {
          ...seoProduct
        }
      }
    }
    updatedAt
  }
  ${seoFragmentProduct}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections {
      items {
        ...collection
      }
    }
  }
  ${collectionFragment}
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String, $id: ID){
    collection(slug: $handle, id: $id) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
query GetCollectionProducts($handle: String, $skip: Int, $take: Int) {
  collection(slug: $handle) {
    id
    name
    description
    featuredAsset {
      id
      preview
    }
  }
  search(
    input: {
      collectionSlug: $handle,
      groupByProduct: true,
      skip: $skip,
      take: $take }
  ) {
    totalItems
    items {
      productName
      slug
      productAsset {
        id
        preview
      }
      priceWithTax {
        ... on SinglePrice {
          value
        }
        ... on PriceRange {
          min
          max
        }
      }
      currencyCode
    }
  }
}
`;

gql`
  query collections {
    collections {
      items {
        id
        name
        slug
        parent {
          name
        }
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`;

gql`
  query collection($handle: String, $id: ID) {
    collection(slug: $handle, id: $id) {
      id
      name
      slug
      breadcrumbs {
        id
        name
        slug
      }
      children {
        id
        name
        slug
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`;


