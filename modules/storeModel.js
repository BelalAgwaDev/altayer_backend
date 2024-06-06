const mongoose = require('mongoose')
const moment = require('moment-timezone')

const StoreSchema = mongoose.Schema(
  {
    StoreName: {
      type: String,
      trim: true,
      unique: [true, 'store Name must be uniqe'],
      required: [true, 'store Name is Required'],
    },

    StoreDescription: {
      type: String,
      trim: true,
      required: [true, 'store description is Required'],
    },

    ratingsAverage: {
      type: Number,
      min: [1, 'rating must be above or equal 1.0'],
      max: [5, 'rating must be blew or equal 5.0'],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    deliveryTime: String,
    minimumPurchases:Number,
    deliveryCharge: Number,
    preOrder: Boolean,

    legalStoreName: {
      type: String,
      trim: true,
      unique: [true, 'Legal store Name must be uniqe'],
      required: [true, 'Legal store Name is Required'],
    },

    deliveryBy: {
      type: String,
      enum: ['Store', 'applicationDelivery', 'StoreAndApplicationDelivery'],
      default: 'applicationDelivery',
    },

    openTime: { type: String },
    closeTime: { type: String },
    timezone: { type: String, default: 'Africa/Cairo' },

    busyHours: [{ start: String, end: String }],

    storeLogoImage: String,
    storeLogoImagePublicId: String,
    storeCoverImagePublicId: String,
    storeCoverImage: String,

    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'category id Required'],
    },

    StoreAddress: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        location: {
          type: {
            type: String,
            enum: ['Point'],
            required: true,
          },
          coordinates: {
            type: [Number],
            required: true,
          },
        },
        storeRegion: {
          type: String,
          trim: true,
          required: [true, 'store Region is Required'],
          minlength: [3, 'Too short store Region'],
          maxlength: [200, 'Too long store Region'],
        },
      },
    ],
    manuallySetStatus: {
      type: String,
      enum: ['open', 'closed', 'busy'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
)


//mongose query middlware
StoreSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "store",
  localField: "_id",
});


StoreSchema.virtual('storeStatus').get(function () {
  if (this.manuallySetStatus) {
    return this.manuallySetStatus;
  }

  const now = moment.tz(this.timezone);
  const openingMoment = moment.tz(
    `${now.format('YYYY-MM-DD')} ${this.openTime}`,
    this.timezone
  );
  const closingMoment = moment.tz(
    `${now.format('YYYY-MM-DD')} ${this.closeTime}`,
    this.timezone
  );

  const isStoreOpen = now.isBetween(openingMoment, closingMoment);
  const isStoreBusy = this.busyHours.some((busyTime) => {
    const busyStart = moment.tz(
      `${now.format('YYYY-MM-DD')} ${busyTime.start}`,
      this.timezone
    );
    const busyEnd = moment.tz(
      `${now.format('YYYY-MM-DD')} ${busyTime.end}`,
      this.timezone
    );
    return now.isBetween(busyStart, busyEnd);
  });

  if (!isStoreOpen) {
    return 'closed';
  }

  if (isStoreBusy) {
    return 'busy';
  }

  return 'open';
});

StoreSchema.set('toObject', { virtuals: true });
StoreSchema.set('toJSON', { virtuals: true });

StoreSchema.index({ 'StoreAddress.location': '2dsphere' });



const StoreModel = mongoose.model('Store', StoreSchema);

module.exports = StoreModel;