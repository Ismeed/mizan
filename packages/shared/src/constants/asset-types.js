"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASSET_TYPES = void 0;
const zakat_types_1 = require("../types/zakat.types");
exports.ASSET_TYPES = [
    { type: zakat_types_1.AssetType.CASH, label: 'Cash' },
    { type: zakat_types_1.AssetType.GOLD, label: 'Gold' },
    { type: zakat_types_1.AssetType.SILVER, label: 'Silver' },
    { type: zakat_types_1.AssetType.BUSINESS_INVENTORY, label: 'Business Inventory' },
    { type: zakat_types_1.AssetType.AGRICULTURAL, label: 'Agricultural Produce' },
    { type: zakat_types_1.AssetType.LIVESTOCK, label: 'Livestock' }
];
