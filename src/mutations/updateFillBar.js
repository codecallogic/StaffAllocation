import { gql } from '@apollo/client';

export default gql`
mutation UpdateFillBar($allocationID: ID!, $fillBars: [FillBarInputType!]!, $userID: ID!, $fillBar: FillBarInputType!) {
  updateFillBar(allocationID: $allocationID, fillBars: $fillBars, userID: $userID, fillBar: $fillBar) {
    id
    username,
    role,
    years {
      id,
      year,
      teams {
        id
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
    },
    users {
      id
      username,
      password,
      role,
      parentID
    }
  }
}
`;