"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionStatus = exports.SubscriptionPlan = void 0;
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["FREE"] = "FREE";
    SubscriptionPlan["PREMIUM"] = "PREMIUM";
    SubscriptionPlan["ENTERPRISE"] = "ENTERPRISE";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["CANCELED"] = "CANCELED";
    SubscriptionStatus["PAST_DUE"] = "PAST_DUE";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
