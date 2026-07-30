"use strict";
/**
 * Islamic Inheritance (Mirath) Types
 * Based on Quran 4:11-12, 4:176 and classical fiqh texts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeirType = void 0;
/** All recognised heir categories in the Hanafi rule engine */
var HeirType;
(function (HeirType) {
    HeirType["HUSBAND"] = "HUSBAND";
    HeirType["WIFE"] = "WIFE";
    HeirType["SON"] = "SON";
    HeirType["DAUGHTER"] = "DAUGHTER";
    HeirType["FATHER"] = "FATHER";
    HeirType["MOTHER"] = "MOTHER";
    HeirType["PATERNAL_GRANDFATHER"] = "PATERNAL_GRANDFATHER";
    HeirType["PATERNAL_GRANDMOTHER"] = "PATERNAL_GRANDMOTHER";
    HeirType["MATERNAL_GRANDMOTHER"] = "MATERNAL_GRANDMOTHER";
    HeirType["FULL_BROTHER"] = "FULL_BROTHER";
    HeirType["FULL_SISTER"] = "FULL_SISTER";
    HeirType["PATERNAL_HALF_BROTHER"] = "PATERNAL_HALF_BROTHER";
    HeirType["PATERNAL_HALF_SISTER"] = "PATERNAL_HALF_SISTER";
    HeirType["MATERNAL_HALF_SIBLING"] = "MATERNAL_HALF_SIBLING";
    HeirType["SON_OF_FULL_BROTHER"] = "SON_OF_FULL_BROTHER";
    HeirType["SON_OF_PATERNAL_HALF_BROTHER"] = "SON_OF_PATERNAL_HALF_BROTHER";
    HeirType["PATERNAL_UNCLE"] = "PATERNAL_UNCLE";
    HeirType["SON_OF_PATERNAL_UNCLE"] = "SON_OF_PATERNAL_UNCLE";
})(HeirType || (exports.HeirType = HeirType = {}));
