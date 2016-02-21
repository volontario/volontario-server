module.exports = {
  schema: {
    addedAt: {type: Date, default: Date.now},
    calendar: [
      {
        hostApproved: Boolean,
        from: Date,
        to: Date,
        userApproved: Boolean,
        userId: String
      }
    ],
    category: {type: String, required: true},
    endsAt: Date,
    name: {type: String, required: true},
    originalId: String,
    origin: String,
    ownerId: {type: String, default: null},
    locationId: {type: String, required: true},
    startsAt: Date,
    url: String,
    updatedAt: {type: Date, default: Date.now}
  },
  methods: [
    function garnish() {
      this.calendar.forEach(function(item) {
        item.id = item._id;
        item._id = undefined;

        if (item.userApproved === false && item.hostApproved === false) {
          item.approvalStatus = 'removed';
        }
        if (item.userApproved === false && item.hostApproved === true) {
          item.approvalStatus = 'cancelled';
        }
        if (item.userApproved === true && item.hostApproved === false) {
          item.approvalStatus = 'pending';
        }
        if (item.userApproved === true && item.hostApproved === true) {
          item.approvalStatus = 'approved';
        }
      });
    },

    function tidy() {
      this.set('id', this._id);
      this._id = this.__v = undefined;
    }
  ]
};
