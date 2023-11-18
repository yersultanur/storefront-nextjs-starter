import productFragment from './product';

const cartFragment = /* GraphQL */ `
  fragment cart on Order {
    id
    code
    active
    createdAt
    state
    currencyCode
    totalQuantity
    subTotal
    subTotalWithTax
    taxSummary {
      description
      taxRate
      taxTotal
    }
    shippingWithTax
    totalWithTax
    total
    customer {
      id
      firstName
      lastName
      emailAddress
    }
    shippingAddress {
      fullName
      streetLine1
      streetLine2
      company
      city
      province
      postalCode
      countryCode
      phoneNumber
    }
    shippingLines {
      shippingMethod {
        id
        name
      }
      priceWithTax
    }
    lines {
      id
      createdAt
      updatedAt
      unitPriceWithTax
      linePriceWithTax
      quantity
      featuredAsset {
        id
        name
        preview
      }
      productVariant {
        id
        name
        price
        currencyCode
        product {
          ...product
        }
        options {
          id
          group {
            id
            name
            code
          }
          groupId
          name
          code
        }
      }
    }
    payments {
      id
      state
      method
      amount
      metadata
    }
  }
  ${productFragment}
`;

export default cartFragment;
