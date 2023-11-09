import cartFragment from 'lib/vendure/providers/fragments/cart';

export const getCartQuery = /* GraphQL */ `
  query getCartQuery {
    activeOrder {
      ...cart
    }
  }
  ${cartFragment}
`;
