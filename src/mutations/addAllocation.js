import { gql } from '@apollo/client';

export default gql`
mutation AddAllocation($userID: ID!, $order: Int!, $fte: String!, $text: String!, $allocation: String!, $color: String!) {
  addAllocationToUser(userId: $userID, order: $order, fte: $fte, text: $text, allocation: $allocation, color: $color) {
    id
    username
    allocations {
      id
      order
      fte
      text
      allocation 
      color
      fillBars {
        id
        order
        fte
        text
        allocation 
      }
    }
    settings {
      id
      type
      order
      content
    }
  }
}
`