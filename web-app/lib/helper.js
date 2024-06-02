import { gql } from "graphql-request";

export const GET_CREDENTIALS_QUERY = gql`
    query keys(
      $first: Int
      $skip: Int
      $orderBy: Key_orderBy
      $orderDirection: OrderDirection
      $where: Key_filter
    ) {
      keys(
        first: $first
        skip: $skip
        orderBy: $orderBy
        orderDirection: $orderDirection
        where: $where
      ) {
        id
        keyId
        keyA
        keyB
        ipfsHash
        owner
        isDeleted
        updatedAt
      }
    }
  `;