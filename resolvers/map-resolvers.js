const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id});
			if(maps) {
				return (maps);
			} 
		},
		getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(map) return map;
			else return ({});
		},
	},
	Mutation: {
		addMap: async (_, args) => {
			const { map } = args;
			const objectId = new ObjectId();
			const { id, name, owner, regions } = map;
			const newMap = new Map({
				_id: objectId,
				name: name,
				owner: owner,
				regions: regions,
			});
			const updated = await newMap.save();
			if (updated) {
				console.log(newMap);
				return newMap;
			}
		},

		deleteMap: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: objectId});
			if (deleted) return true;
			else return false;
		}, 

		updateMap: async (_, args) => {
			const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Map.updateOne({_id: objectId}, {[field]: value});
			if (updated) return value;
			else return "";
		},

		addRegion: async (_, args) => {
			const { _id, region, index } = args;
			const listId = new ObjectId(_id);
			const objectId = new ObjectId();
			const found = await Map.findOne({_id: listId});
			if (!found) return ('Map not found');
			if (region._id === '') region._id = objectId;
			let listRegions = found.regions;
			if (index < 0) listRegions.push(region);
			else listRegions.splice(index, 0, region);

			const updated = await Map.updateOne({_id: listId}, {regions: listRegions});
			if (updated) return (region._id);
			else return ('could not add item');
		}
	}
}