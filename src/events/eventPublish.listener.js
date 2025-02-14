const {userService} = require('../services');

const onEventPublish = async ({event}) => {
    await userService.updateEventManagerById(event.createdBy, {$inc: {totalEvents: 1}});
  };


  module.exports = {onEventPublish}