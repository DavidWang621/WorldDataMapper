const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		name: String!
		owner: String!
		regions: [Region]
	}
	type Region {
		_id: String!
		name: String!
		capital: String!
		leader: String!
		landmarks: [String]
	}
	extend type Query {
		getAllMaps: [Map]
		getMapById(_id: String!): Map 
	}
	extend type Mutation {
		addMap(map: MapInput!): Map
		deleteMap(_id: String!): Boolean
		updateMap(_id: String!, value: String!): String
		addRegion(region: RegionInput!, _id: String!, index: Int!): String
		updateRegion(mapId: String!, _id: String!, value: String!, field: String!): [Region]
		deleteRegion(mapId: String!, itemId: String!): [Region]
		sortRegion(_id: String!, criteria: String!, order: Boolean!): [Region]
		addLandmark(mapId: String!, regionId: String!, value: String!, index: Int!): [Region]
	}
	input MapInput {
		_id: String
		name: String
		owner: String
		regions: [RegionInput]
	}
	input RegionInput {
		_id: String
		name: String
		capital: String
		leader: String
		landmarks: [String]
	}
`;

module.exports = { typeDefs: typeDefs }