import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'RELAX digital',
    },
    supportEmail: {
      type: String,
      default: 'support@relaxdigital.io',
    },
    currency: {
      type: String,
      default: 'USD ($)',
    },
    taxRate: {
      type: Number,
      default: 8.5,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    autoConfirmOrders: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
