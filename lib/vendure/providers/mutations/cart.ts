import cartFragment from '../fragments/cart';

export const addToCartMutation = /* GraphQL */ `
  mutation addToCart($cartId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $cartId, quantity: $quantity) {
      ...cart
      ... on ErrorResult {
        errorCode
        message
      }
      ... on InsufficientStockError {
        quantityAvailable
        order {
          ...cart
        }
      }
    }
  }
  ${cartFragment}
`;

export const createCartMutation = /* GraphQL */ `
  mutation createCart($cartId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $cartId, quantity: $quantity) {
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
