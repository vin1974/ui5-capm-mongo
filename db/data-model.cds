using {cuid, managed, temporal, Currency, Country} from '@sap/cds/common';
namespace click4me;
entity customer: managed{
    key id: String(256);
    name: String(256);
    type: String(2);
    emailId: String(105);
    contactNo: String(32);
    address: String(256);
    companyName: String(128);
    country: String(128);
}