/* jshint esversion: 6 */
/* jshint node: true */
'use strict';

const uuid = require('uuid');
const aws = require('aws-sdk');
const joi = require('joi');

aws.config.setPromisesDependency(require('bluebird'));

const dynamoDB = new aws.DynamoDB.DocumentClient();

//  Create Template Method
module.exports.Create = (event, context, callback) => {

    //console.log("Receives request to create Message Template. Event is : ", event);

    const requestBody = JSON.parse(event.body);

    const name = requestBody.name;

    const msgText = requestBody.msgText;

    console.log("recibiendo ---> name :", name);
    console.log("recibiendo ---> msgText :", msgText);

    if (typeof name !== 'string' || typeof msgText !== 'string') {
        console.error('Validation Failed');
        callback(new Error('Couldn\'t submit Message Template because of validation errors.'));
        return;
    }

    createTmpl(templateInfo(name, msgText))
        .then(res => {
            callback(null, {
                statuscode: 200,
                body: JSON.stringify({
                    message: `Mensaje creado ${name}`
                        //,TemplateId: res.user_id
                })
            });
        })
        .catch(err => {

            console.log("Mostrando el Error ----> :", err);
            callback(null, {
                statuscode: 500,
                body: JSON.stringify({
                    message: `No se pudo crear el mensaje ${name}`
                })
            });

        });

};


// Update Template Method
module.exports.update = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);

    const name = requestBody.name;
    const msgText = requestBody.msgText;
    const user_id = requestBody.user_id;
    const template_id = requestBody.template_id;

    if (typeof name !== 'string' || typeof msgText !== 'string' || typeof user_id !== 'string' || typeof template_id !== 'string') {

        console.error('Validation failed');
        callback(new Error('Coudn\'t update message template because Validation errors.'));

        return;
    }




};

const createTmpl = template => {
    const templateInfo = {
        TableName: "Templates",
        Item: template,
    };

    //process.env.Table_Name,
    return dynamoDB.put(templateInfo).promise()
        .then(res => template)
        .catch(err => { console.log("Mostrando el error interno ... :", err); });

};

const templateInfo = (name, msgText) => {

    return {
        user_id: uuid.v1(),
        template_id: uuid.v1(),
        name: name,
        msgText: msgText
    };

};