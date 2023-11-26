import { gql } from '@apollo/client';

export default gql`
query User($id: ID!, $token: String!) {
  user(id: $id, token: $token){
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
      color
    }
  }
}
`