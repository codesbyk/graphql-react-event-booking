const { buildSchema } = require('graphql');


module.exports = buildSchema(`

    # -------------------------------------------------- Start
    # Custom types for the what output need after execution
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
    }

    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    #--------------------------------------------------- End

    # -------------------------------------------------- Start
    # Custom Inputs for what to pass to either backend / database
    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }


    input UserInput {
        email: String!
        password: String!

    }

    #--------------------------------------------------- End


    # -------------------------------------------------- Start
    # All Read Queries Object
    type RootQuery {
        events: [Event!]!
        bookings: [Booking!]!
    }

    # -------------------------------------------------- End


    # -------------------------------------------------- Start
    # All Resolve Mutation Queries Object
    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
    }
    # -------------------------------------------------- End


    # -------------------------------------------------- Start
    # The final schema of all the inputs and output used in graphql
    schema {
        query: RootQuery
        mutation: RootMutation
    }

    # -------------------------------------------------- End
`)