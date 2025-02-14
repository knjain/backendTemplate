const {salonService} = require('../services/salon');

async function getSalonById(id, user) {
  const data = await salonService.findSalonById(id);
  if (user._id.toString() !== data.owner.toString() && user.__t !== 'Admin') {
    ['taxPayId', 'businessId', 'businessDoc'].map(key => {
      delete data[key];
    });
  }
  return data;
}

module.exports = {
  getSalonById,
};
