const { createYoga } = require('graphql-yoga')
const { createServer } = require('http')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const typeDefs = /* GraphQL */ `
  type Order {
    id: ID!
    merchantImage: String!
    merchantName: String!
    merchantLogo: String!
    date: String!
    nextDueAmount: Float!
    nextDueDate: String!
    status: String!
    reference: String!
    price: Float!
    numberOfArticles: Int!
    shippedArticles: Int!
  }

  type Query {
    orders: [Order]
    orderById(orderId: ID!): Order
  }

  type Mutation {
    payOrder(orderId: ID!): Order
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

const orders = [
  {
    id: '1',
    merchantName: 'Amazon',
    merchantImage:
      'https://res.cloudinary.com/caskchain/image/upload/v1717158058/Sequra/amazon.png',
    merchantLogo:
      'https://cdn.iconscout.com/icon/free/png-512/free-amazon-1543560-1306063.png',
    date: '2021-10-01',
    nextDueAmount: 100,
    nextDueDate: '2021-11-01',
    status: 'pending',
    reference: '123456789',
    price: 100,
    numberOfArticles: 5,
    shippedArticles: 2,
  },
  {
    id: '2',
    merchantName: 'Ebay',
    merchantImage:
      'https://res.cloudinary.com/caskchain/image/upload/v1717158059/Sequra/ebay.png',
    merchantLogo:
      'https://cdn.iconscout.com/icon/free/png-512/free-ebay-13-675708.png',
    date: '2021-10-01',
    nextDueAmount: 200,
    nextDueDate: '2021-11-01',
    status: 'completed',
    reference: '987654321',
    price: 200,
    numberOfArticles: 10,
    shippedArticles: 5,
  },
  {
    id: '3',
    merchantName: 'Costco',
    merchantImage:
      'https://res.cloudinary.com/caskchain/image/upload/v1717158062/Sequra/costco.png',
    merchantLogo:
      'https://cdn.iconscout.com/icon/free/png-512/free-costco-282448.png',
    date: '2023-05-30',
    nextDueAmount: 300,
    nextDueDate: '2024-11-01',
    status: 'pending',
    reference: '123456777',
    price: 300,
    numberOfArticles: 15,
    shippedArticles: 7,
  },
]

const resolvers = {
  Query: {
    orders() {
      return orders
    },
    orderById(_, { orderId }) {
      return orders.find((order) => order.id === orderId) ?? null
    },
  },
  Mutation: {
    payOrder(_, { orderId }) {
      const order = orders.find((order) => order.id === orderId)
      if (!order) {
        throw new Error(`Couldn't find order with id ${orderId}`)
      }

      order.status = 'completed'
      return order
    },
  },
}

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const yoga = createYoga({
  schema: executableSchema,
})

const server = createServer(yoga)

server.listen(process.env.PORT || 4000, () => {
  console.log('Yoga is listening at http://localhost:4000/graphql')
})
