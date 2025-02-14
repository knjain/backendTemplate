const dbOptions = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const maxPromotionImages = 5;
const maxPromotionVideo = 1;

const imgTypeToExtension = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/svg': 'svg',
  'image/svg+xml': 'svg+xml',
};

const docTypeToExtension = {
  'text/plain': 'txt',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
};

const mimetypeToExtension = {
  ...imgTypeToExtension,
  ...docTypeToExtension,
};

const imageTypes = Object.keys(imgTypeToExtension);
const docTypes = Object.keys(docTypeToExtension);
const fileTypes = [...imageTypes, ...docTypes];

const categoryTypes = ['event', 'appointment', 'restaurant'];

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const restaurantSlotCategoryTypes = ['Breakfast', 'Lunch', 'Dinner'];

const salonSlotCategoryTypes = ['Morning', 'Afternoon', 'Evening'];

const bookingStatusTypes = ['Confirmed', 'Cancelled', 'Pending', 'Rejected'];

const notificationStatusTypes = {
  SCHEDULED: 'scheduled',
  SENT: 'sent',
};
const partnerStatusTypes = ['Pending', 'Active', 'Suspended'];
const partnerRequestTypes = ['Accept', 'Reject'];

const serviceDurationValues = [
  '15 mins',
  '30 mins',
  '45 mins',
  '1 hr ',
  '1 hr 15 mins',
  '1 hr 30 mins',
  '1 hr 45 mins',
  '2hrs',
];

// Follow Kebab Case for platformSettingNames object for cleaner URLs
const platformSettingNames = {PLATFORM_CHARGES: 'platform-charges'};

const initialPlatformSettings = [{name: platformSettingNames.PLATFORM_CHARGES, value: 10, unit: '%'}];

const eventNames = {
  EVENT_BOOKING_CREATED: 'event-booking-created',
  EVENT_TICKET_SCANNED:'ticket-status-update',
  restaurantVendor: {
    suspension: 'suspendRestaurantVendor',
    rejection: 'rejectRestaurantVendor',
  },
  eventManager: {
    suspension: 'suspendEventManager',
    rejection: 'rejectEventManager',
  },
  salonOwner: {
    suspension: 'suspendSalonOwner',
    rejection: 'rejectSalonOwner',
  },
  EVENT_COUNT_FOR_EVENT_MANAGER:'increment-total-events'
};

const status = {
  SUSPENDED: 'Suspended',
  ACTIVE: 'Active',
};

const partnerRequest = {
  ACCEPT: 'Accept',
  REJECT: 'Reject',
};

module.exports = {
  eventNames,
  platformSettingNames,
  initialPlatformSettings,
  notificationStatusTypes,
  dbOptions,
  serviceDurationValues,
  categoryTypes,
  maxPromotionImages,
  maxPromotionVideo,
  dayNames,
  restaurantSlotCategoryTypes,
  imageTypes,
  docTypes,
  fileTypes,
  imgTypeToExtension,
  docTypeToExtension,
  mimetypeToExtension,
  bookingStatusTypes,
  salonSlotCategoryTypes,
  partnerStatusTypes,
  partnerRequestTypes,
  status,
  partnerRequest,
};
