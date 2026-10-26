import Setting from '../models/Setting.js';

// @desc    Get application settings
// @route   GET /api/settings
// @access  Public / Authenticated
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res, next) => {
  try {
    const { storeName, supportEmail, currency, taxRate, shippingFee, maintenanceMode, autoConfirmOrders } = req.body;

    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    if (storeName) settings.storeName = storeName.trim();
    if (supportEmail) settings.supportEmail = supportEmail.trim();
    if (currency) settings.currency = currency.trim();
    if (taxRate !== undefined) settings.taxRate = Number(taxRate);
    if (shippingFee !== undefined) settings.shippingFee = Number(shippingFee);
    if (maintenanceMode !== undefined) settings.maintenanceMode = Boolean(maintenanceMode);
    if (autoConfirmOrders !== undefined) settings.autoConfirmOrders = Boolean(autoConfirmOrders);

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Platform settings saved successfully!',
      settings,
    });
  } catch (error) {
    next(error);
  }
};
