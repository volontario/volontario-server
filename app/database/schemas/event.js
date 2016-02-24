module.exports = function(mongoose) {
  const fields = {
    addedAt: {type: Date, default: Date.now},
    calendar: [
      {
        approvalStatus: String,
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
  };

  const Schema = new mongoose.Schema(fields);

  Schema.pre('save', function(next) {
    const deduceApproval = function(item) {
      if (item.userApproved === false && item.hostApproved === false) {
        return 'removed';
      }
      if (item.userApproved === false && item.hostApproved === true) {
        return 'cancelled';
      }
      if (item.userApproved === true && item.hostApproved === false) {
        return 'pending';
      }
      if (item.userApproved === true && item.hostApproved === true) {
        return 'approved';
      }
    };

    this.calendar.forEach(function(item) {
      item.approvalStatus = deduceApproval(item);
    });

    next();
  });

  return Schema;
};
