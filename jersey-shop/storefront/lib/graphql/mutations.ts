/**
 * Saleor GraphQL Mutations
 */

export const CHECKOUT_CREATE_MUTATION = /* GraphQL */ `
  mutation CheckoutCreate($channel: String!, $lines: [CheckoutLineInput!]!) {
    checkoutCreate(input: { channel: $channel, lines: $lines }) {
      checkout {
        id
        token
        totalPrice {
          gross {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CHECKOUT_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CheckoutLinesAdd($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
    checkoutLinesAdd(id: $checkoutId, lines: $lines) {
      checkout {
        id
        lines {
          id
          quantity
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_SHIPPING_ADDRESS_UPDATE_MUTATION = /* GraphQL */ `
  mutation CheckoutShippingAddressUpdate(
    $checkoutId: ID!
    $shippingAddress: AddressInput!
  ) {
    checkoutShippingAddressUpdate(
      id: $checkoutId
      shippingAddress: $shippingAddress
    ) {
      checkout {
        id
        shippingAddress {
          firstName
          lastName
          streetAddress1
          city
          postalCode
          country {
            code
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_COMPLETE_MUTATION = /* GraphQL */ `
  mutation CheckoutComplete($checkoutId: ID!) {
    checkoutComplete(id: $checkoutId) {
      order {
        id
        number
        status
      }
      errors {
        field
        message
      }
    }
  }
`;

export const TOKEN_CREATE_MUTATION = /* GraphQL */ `
  mutation TokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      user {
        id
        email
        firstName
        lastName
      }
      errors {
        field
        message
      }
    }
  }
`;
