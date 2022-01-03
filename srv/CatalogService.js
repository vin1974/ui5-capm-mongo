const cds = require("@sap/cds");
const proxy = require('@sap/cds-odata-v2-adapter-proxy');
const MongoClient = require("mongodb").MongoClient;

//please create .env file with HOST_URL
const dotenv = require('dotenv');
dotenv.config();
const uri = process.env.HOST_URL;

const db_name = "cds_app";
const client = new MongoClient(uri);
const ObjectId = require("mongodb").ObjectID;

async function _createCustomer(req){
    await client.connect();
    var db = await client.db(db_name);
    var customer = await db.collection("customer");

    //validation logic -regex
    var rec_count = await customer.find({name: {
        $regex: new RegExp("^" + req.data.name, "i")
    }}).count();
    if (rec_count >= 1){
        throw new Error("Customer Already exist");
    }

    const results = await customer.insertOne(req.data);

    if (results.insertedId){
        req.data.id = results.insertedId.toString();
    }
    return req.data;
}

async function _getAllCustomers(req){
    await client.connect();

    var db = await client.db(db_name);
    var filter, results, limit, offset;

    var sel = req.query.SELECT;

    //filter
    if(sel.one){
        var sId = sel.from.ref[0].where[2].val;
        filter = {_id: ObjectId(sId)};
    }

    //pagination
    if (sel.limit){
        limit = sel.limit.rows.val;
        if(sel.limit.offset){
            offset = sel.limit.offset.val;
        }else{
            offset = 0;
        }
    }else{
        limit = 1000;
        offset = 0;
    }

    var collection_customers = await db.collection('customer');
    results = await collection_customers
                    .find(filter)
                    .limit(offset + limit)
                    .toArray();
    results = results.slice(offset);
    
    for (var i=0; i<results.length; i++){
        results[i].id = results[i]._id.toString();
    }

    return results;
}

async function _updateCustomer(req){
    console.log('update function called....')
    await client.connect();
    var db = await client.db(db_name);
    var sapUsers = await db.collection('customer');
    var data = req.data;
    var sId = ObjectId(data.id);
    delete data.id;
    const results = await sapUsers.updateOne( {_id: sId}, {$set: data} );

    if (results.modifiedCount === 1){
        delete data._id;
        data.id = sId;
        return data;
    }else{
        console.log(results.result);
        return results.result;
    }
}

async function _deleteCustomer(req){
    await client.connect();
    var db = client.db(db_name);
    var sapUsers = await db.collection('customer');
    var data = req.data;
    var sId = ObjectId(data.id);
    const results = await sapUsers.deleteOne({_id: sId});
    return results;
}

async function _getCusomerByCountry(req){
    await client.connect();
    var db = await client.db(db_name);
    var customer = await db.collection("customer");
    const results = await customer.aggregate([
        // { $match: { country: 'FR'}},
        { $group: { _id: "$country", count: { $sum: 1 }}},
        { $sort: {count: -1}}
    ])
    return results.toArray();
}

module.exports = cds.service.impl(function(){
    const { customer } = this.entities;
    this.on("INSERT", customer, _createCustomer);
    this.on("READ", customer, _getAllCustomers);
    this.on("getCusomerByCountry", _getCusomerByCountry);
    this.on("UPDATE", customer, _updateCustomer);
    this.on("DELETE", customer, _deleteCustomer);
});