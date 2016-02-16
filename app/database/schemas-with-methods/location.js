module.exports = {
  schema: {
    addedAt: {type: Date, default: Date.now},
    category: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    name: String,
    ownerId: {type: String, default: null},
    url: String,
    updatedAt: {type: Date, default: Date.now}
  },
  methods: [
    function tidy() {
      this.set('id', this._id);
      this._id = this.__v = undefined;
    }
  ]
};
