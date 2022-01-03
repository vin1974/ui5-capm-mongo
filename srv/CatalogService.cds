using { click4me } from '../db/data-model';
service CatalogService @(path: '/CatalogService'){
    entity customer as projection on click4me.customer;
    action getCusomerByCountry()
    returns array of {
                        _id: String;
                        count: Integer64;
                    }
    
}