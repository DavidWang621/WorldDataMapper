import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			firstName
			lastName
			password
			initials
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
		register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
			email
			password
			firstName
			lastName
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const UPDATE = gql`
	mutation Update($email: String!, $password: String!, $firstName: String!, $lastName: String!, $oldEmail: String!) {
		update(email: $email, password: $password, firstName: $firstName, lastName: $lastName, oldEmail: $oldEmail) {
			email
			password
			firstName
			lastName
		}
	}
`;

export const ADD_MAP = gql`
	mutation AddMap($map: MapInput!) {
		addMap(map: $map) {
			_id
			name
			owner
			regions {
				_id
				name
				capital
				leader
				landmarks
			}
		}
	}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!) {
		deleteMap(_id: $_id)
	}
`;

export const UPDATE_MAP = gql`
	mutation UpdateMap($_id: String!, $value: String!) {
		updateMap(_id: $_id, value: $value)
	}
`;

export const ADD_REGION = gql`
	mutation AddRegion($region: RegionInput!, $_id: String!, $index: Int!) {
		addRegion(region: $region, _id: $_id, index: $index)
	}
`;

export const UPDATE_REGION = gql`
	mutation UpdateRegion($mapId: String!, $_id: String!, $value: String!, $field: String!) {
		updateRegion(mapId: $mapId, _id: $_id, value: $value, field: $field) {
			_id
			name
			capital
			leader
			landmarks
		}
	}
`;

export const DELETE_REGION = gql`
	mutation DeleteRegion($mapId: String!, $itemId: String!) {
		deleteRegion(mapId: $mapId, itemId: $itemId) {
			_id
			name
			capital
			leader
			landmarks
		}
	}
`;

export const SORT_REGION = gql`
	mutation SortRegion($_id: String!, $criteria: String!, $order: Boolean!) {
		sortRegion(_id: $_id, criteria: $criteria, order: $order) {
			_id
			name
			capital
			leader
			landmarks
		}
	}
`;

export const ADD_LANDMARK = gql`
	mutation AddLandmark($mapId: String!, $regionId: String!, $value: String!, $index: Int!) {
		addLandmark(mapId: $mapId, regionId: $regionId, value: $value, index: $index) {
			_id
			name
			capital
			leader
			landmarks
		}
	}
`;