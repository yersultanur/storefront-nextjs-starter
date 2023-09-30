import gql from 'graphql-tag';
import { SearchQueryVariables } from '../../generated/graphql';
import productFragment from '../fragments/product';

export const getProductQuery = /* GraphQL */ `
query getProduct($handle: String, $id: ID) {
    product(slug: $handle, id: $id) {
      ...product
    }
  }
  ${productFragment}
`

export const getProductsQuery = /* GraphQL */ `
  query getProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
          ...product
        }
      }
    }
  ${productFragment}
`;

export const listedProductFragment = gql`
  fragment ListedProduct on SearchResult {
    productId
    productName
    slug
    productAsset {
      id
      preview
    }
    currencyCode
    priceWithTax {
      ... on PriceRange {
        min
        max
      }
      ... on SinglePrice {
        value
      }
    }
  }
`;

gql`
  query search($input: SearchInput!) {
    search(input: $input) {
      totalItems
      items {
        ...ListedProduct
      }
      facetValues {
        count
        facetValue {
          id
          name
          facet {
            id
            name
          }
        }
      }
    }
  }
  ${listedProductFragment}
`;

gql`
  query searchFacetValues($input: SearchInput!) {
    search(input: $input) {
      totalItems
      facetValues {
        count
        facetValue {
          id
          name
          facet {
            id
            name
          }
        }
      }
    }
  }
  ${listedProductFragment}
`;
