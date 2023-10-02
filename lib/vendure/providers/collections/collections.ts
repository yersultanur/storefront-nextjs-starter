import gql from 'graphql-tag';

import productFragment from '../../providers/fragments/product';
import seoFragmentCollection from '../fragments/seoCollection';


const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    slug
    name
    description
    ...seoCollection
    updatedAt
  }
  ${seoFragmentCollection}
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
      price {
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


