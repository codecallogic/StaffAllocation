import { gql } from '@apollo/client';

export default gql`
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id) {
    id,
    name,
    username,
    role,
    years {
      year,
      teams {
        team,
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
  }
}
`;