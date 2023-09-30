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
  query getCollection($slug: String, $id: ID){
    collection(slug: $slug, id: $id) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProductsQuery($options: ProductListOptions) {
    products(options: $options){
      items{
      ...product
      }
    }
  }
  ${productFragment}
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
  query collection($slug: String, $id: ID) {
    collection(slug: $slug, id: $id) {
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


