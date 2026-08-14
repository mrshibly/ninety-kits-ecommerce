/**
 * Saleor GraphQL Queries
 */

export const PRODUCTS_LIST_QUERY = /* GraphQL */ `
  query ProductsList($first: Int = 20, $channel: String!) {
    products(first: $first, channel: $channel) {
      edges {
        node {
          id
          name
          slug
          description
          thumbnail {
            url
            alt
          }
          category {
            id
            name
            slug
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          variants {
            id
            name
            sku
            quantityAvailable
            attributes {
              attribute {
                name
                slug
              }
              values {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_SLUG_QUERY = /* GraphQL */ `
  query ProductBySlug($slug: String!, $channel: String!) {
    product(slug: $slug, channel: $channel) {
      id
      name
      slug
      description
      media {
        url
        alt
      }
      category {
        name
      }
      pricing {
        priceRange {
          start {
            gross {
              amount
              currency
            }
          }
        }
      }
      variants {
        id
        name
        sku
        quantityAvailable
        attributes {
          attribute {
            name
            slug
          }
          values {
            name
            value
          }
        }
      }
    }
  }
`;

export const CHECKOUT_QUERY = /* GraphQL */ `
  query CheckoutDetails($id: ID!) {
    checkout(id: $id) {
      id
      email
      subtotalPrice {
        gross {
          amount
          currency
        }
      }
      shippingPrice {
        gross {
          amount
          currency
        }
      }
      totalPrice {
        gross {
          amount
          currency
        }
      }
      lines {
        id
        quantity
        variant {
          id
          name
          product {
            name
            thumbnail {
              url
            }
          }
        }
      }
    }
  }
`;

export const USER_ORDERS_QUERY = /* GraphQL */ `
  query UserOrders($first: Int = 10) {
    me {
      id
      email
      firstName
      lastName
      orders(first: $first) {
        edges {
          node {
            id
            number
            created
            status
            paymentStatus
            total {
              gross {
                amount
                currency
              }
            }
            lines {
              id
              productName
              variantName
              quantity
            }
          }
        }
      }
    }
  }
`;
