module.exports = {
  schema: {
    addedAt: {type: Date, default: Date.now},
    category: {type: String, required: true},
    coordinates: {
      latitude: {type: Number, required: true},
      longitude: {type: Number, required: true}
    },
    name: {type: String, required: true},
    ownerId: {type: String, required: true, default: null},
    url: {type: String, required: true},
    updatedAt: {type: Date, default: Date.now}
  },

  methods: [
  ]
};
