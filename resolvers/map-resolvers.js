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
			const { value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Map.updateOne({_id: objectId}, {name: value});
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
		}, 

		updateRegion: async (_, args) => {
			const { mapId, _id, value, field} = args;
			const listId = new ObjectId(mapId);
			const found = await Map.findOne({_id: listId});
			let listItem = found.regions;
			listItem.map(regions => {
				if(regions._id.toString() === _id) {
					regions[field] = value;
				}
			});
			const updated = await Map.updateOne({_id: listId}, { regions: listItem })
			if (updated) return (listItem);
			else return (found.items);
		}, 

		deleteRegion: async (_, args) => {
			const { mapId, itemId } = args;
			const listId = new ObjectId(mapId);
			const found = await Map.findOne({_id: listId});
			let listItems = found.regions;
			listItems = listItems.filter(item => item._id.toString() !== itemId);
			const updated = await Map.updateOne({_id: listId}, { regions: listItems })
			if (updated) return (listItems);
			else return (found.items);
		}, 

		sortRegion: async (_, args) => {
			const { _id, criteria, order} = args;
			const listId = new ObjectId(_id);
			const list = await Map.findOne({_id: listId});
			let regions = list.regions;
			regions.sort(function (item1, item2) {
				let negate = -1;
				if (!order) {
				  negate = 1;
				}
				let value1 = item1[criteria];
				let value2 = item2[criteria];
				if (value1 < value2) {
				  return -1 * negate;
				}
				else if (value1 === value2) {
				  return 0;
				}
				else {
				  return 1 * negate;
				}
			}); 
			const updated = await Map.updateOne({_id: listId}, {regions: regions});
			if (updated) return regions;
			return list.regions;
		}
	}
}