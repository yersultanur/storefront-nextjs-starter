import cartFragment from '../fragments/cart';

export const addToCartMutation = /* GraphQL */ `
mutation addToCart($productVariantId: ID!, $quantity: Int!) {
  addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
    ...cart
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
  ${cartFragment}
`;

export const createCartMutation = /* GraphQL */ `
mutation createCart($productVariantId: ID!, $quantity: Int!) {
  addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
    ...cart
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
  ${cartFragment}
`;

export const editCartItemsMutation = /* GraphQL */ `
mutation editCartItems($orderLineId: ID!, $quantity: Int!) {
  adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
    ...cart
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
  ${cartFragment}
`;

export const removeFromCartMutation = /* GraphQL */ `
mutation removeFromCart($orderLineId: ID!) {
  removeOrderLine(orderLineId: $orderLineId) {
    ...cart
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
  ${cartFragment}
`;